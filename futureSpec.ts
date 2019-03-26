import { Future, map, flatMap, fork, resolve } from './future';
import * as assert from 'assert';

function testError<Error, U>(a: Future<Error, U>, message: string): void {
  fork(
    rj => {
      assert(rj.toString() === message);
      console.log('test passed');
    },
    _rs => assert(false),
    a,
  );
}

function testEqual<T, U>(a: Future<T, U>, b: Future<T, U>): void {
  const zipped = flatMap(aVal => {
    return map(bVal => [aVal, bVal], b);
  }, a);

  fork(
    rj => rj,
    ([aVal, bVal]) => {
      assert(aVal === bVal);
      console.log('test passed');
    },
    zipped,
  );
}

const byThree = (val: number): Future<Error, number> => (_rej, res) => {
  setTimeout(() => res(val * 3), 300);
};

const byFour = (val: number): Future<Error, number> => (_rej, res) => {
  setTimeout(() => res(val * 4), 400);
};

const err = (val: number): Future<Error, number> => rej => {
  setTimeout(() => rej(new Error('Timeout')), 500);
};

const one: Future<Error, number> = (_rej, res) => {
  setTimeout(() => res(10), 1000);
};

// map & flatMap

const two = map(x => x * 2, one);
const three = flatMap(byThree, two);
testEqual(three, resolve(60));

// errors

const four = flatMap(err, two);
testError(four, 'Error: Timeout');

// monadic laws

const a = 3;
const f = byThree;
// Left identity: unit(a).bind(f) === f(a)
// flatMap(f, resolve(a)) === f(a);
testEqual(flatMap(f, resolve(a)), f(a));

const m = resolve(3);
// Right identity: m.bind(unit) === m;
// flatMap(resolve, m) === m;
testEqual(flatMap(resolve, m), m);

const g = byFour;
// Associativity: m.bind(f).bind(g) === m.bind(x => f(x).bind(g))
// flatMap(g, flatMap(f, m)) === flatMap(x => flatMap(g, f(x)), m);
testEqual(flatMap(g, flatMap(f, m)), flatMap(x => flatMap(g, f(x)), m));
