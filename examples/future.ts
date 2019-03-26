import { of, reject, flatMap, map, Future } from '../future';
import { get } from 'https';

class FutureMonad<T, U> {
  constructor(public future: Future<T, U>) {}

  flatMap<V>(fn: (val: U) => Future<T, V>): FutureMonad<T, V> {
    return new FutureMonad(flatMap(fn, this.future));
  }

  map<V>(fn: (val: U) => V): FutureMonad<T, V> {
    return this.flatMap(x => of(fn(x)));
  }

  static all<T, U>(monads: FutureMonad<T, U>[]): FutureMonad<T, U[]> {
    if (monads.length === 0) {
      return new FutureMonad(of([]));
    }

    const fut = (rej: (e: T) => void, res: (u: U[]) => void) => {
      const resolved: Record<number, U> = {};

      let rejected = false;
      monads.forEach((monad, idx) => {
        monad.future(
          err => {
            if (rejected) {
              return;
            }

            rejected = true;
            rej(err);
          },
          val => {
            if (rejected) {
              return;
            }

            resolved[idx] = val;
            const keys = Object.keys(resolved);
            if (keys.length === monads.length) {
              const values = Object.values(resolved);
              res(values);
            }
          },
        );
      });
    };

    return new FutureMonad(fut);
  }
}

function getUsers(rej: (e: Error) => void, res: (s: string) => void): void {
  get('https://jsonplaceholder.typicode.com/users', resp => {
    let data = '';

    const { statusCode } = resp;
    if (statusCode !== 200) {
      rej(new Error(`StatusCode: ${statusCode}`));
      return;
    }

    resp.on('data', chunk => (data += chunk));
    resp.on('end', () => res(data));
  }).on('error', rej);
}

function getPostsByUserId(userId: number): Future<Error, string> {
  return (rej, res) => {
    get(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`, resp => {
      let data = '';

      const { statusCode } = resp;
      if (statusCode !== 200) {
        rej(new Error(`StatusCode: ${statusCode}`));
        return;
      }

      resp.on('data', chunk => (data += chunk));
      resp.on('end', () => res(data));
    }).on('error', rej);
  };
}

function parseBody(body: string): Future<Error, {}> {
  try {
    const parsed = JSON.parse(body);
    return of(parsed);
  } catch (err) {
    return reject(err);
  }
}

function parseList(json: {}): Future<Error, [{}, {}]> {
  if (!Array.isArray(json)) {
    return reject(new Error('not an array'));
  }
  const [first, second] = json;
  if (first === undefined || second === undefined) {
    return reject(new Error('array is too small'));
  }
  const tuple: [{}, {}] = [first, second];
  return of(tuple);
}

function pickRandom<T>(tuple: [T, T]): T {
  const idx = Math.floor(Math.random() * Math.floor(2));
  return tuple[idx];
}

function parseUser(user: any): Future<Error, number> {
  const { id } = user;
  if (!Number.isFinite(id)) {
    return reject(new Error('could not parse user id'));
  }
  return of(id);
}

function getUserById(id: number): Future<Error, string> {
  return (rej, res) => {
    get(`https://jsonplaceholder.typicode.com/users/${id}`, resp => {
      let data = '';

      const { statusCode } = resp;
      if (statusCode !== 200) {
        rej(new Error(`StatusCode: ${statusCode}`));
        return;
      }

      resp.on('data', chunk => (data += chunk));
      resp.on('end', () => res(data));
    }).on('error', rej);
  };
}

new FutureMonad(getUsers)
  .flatMap(parseBody)
  .flatMap(parseList)
  .map(pickRandom)
  .flatMap(parseUser)
  .flatMap(getPostsByUserId)
  .future(console.error, console.log);

const f1 = new FutureMonad(getUserById(3));
const f2 = new FutureMonad(getUserById(4));
FutureMonad.all([f1, f2])
  .map(bodies => bodies.map(body => JSON.parse(body)))
  .map(json => JSON.stringify(json, null, 2))
  .future(console.error, console.log);
