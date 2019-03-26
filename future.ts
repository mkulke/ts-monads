type Handler<T> = (t: T) => void;
type Future<T, U> = (reject: Handler<T>, resolve: Handler<U>) => void;

function of<T, U>(val: U): Future<T, U> {
  return (_rej, res) => res(val);
}

function reject<T, U>(val: T): Future<T, U> {
  return (rej, _res) => rej(val);
}

function fork<T, U>(rej: Handler<T>, res: Handler<U>, fut: Future<T, U>): void {
  fut(rej, res);
}

function map<T, U, V>(fn: (val: U) => V, future: Future<T, U>): Future<T, V> {
  return flatMap(x => of(fn(x)), future);
}

function flatMap<U, V, T>(
  fn: (val: U) => Future<T, V>,
  fut: Future<T, U>,
): Future<T, V> {
  return (rej, res) => fut(rej, val => fork(rej, res, fn(val)));
}

function flatten<T, U>(fut: Future<T, Future<T, U>>): Future<T, U> {
  return flatMap(x => x, fut);
}

export { Future, flatten, flatMap, fork, map, reject, of, of as resolve };
