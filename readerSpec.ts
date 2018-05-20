import { ask, doM, flatMap, of, Reader, run } from './reader';
import * as assert from 'assert';

function testEqual<T>(a: Reader<{}, T>, b: Reader<{}, T>): void {
  const x = run({}, a);
  const y = run({}, b);
  assert(x === y);
  console.log('test passed');
}

function* handler(n: number) {
  const ctx = yield ask();
  return of(ctx * n);
}

const ctx = 4;
const reader = doM(handler(2));
const result = run(ctx, reader);
assert(result === 8);
console.log('test passed');

// monadic laws

const byThree = (val: number): Reader<{}, number> => of(val * 3);
const byFour = (val: number): Reader<{}, number> => of(val * 4);

const a = 3;
const f = byThree;
// Left identity: unit(a).bind(f) === f(a)
// flatMap(f, some(a)) === f(a);
testEqual(flatMap(f, of(a)), f(a));

const m = of(3);
// Right identity: m.bind(unit) === m;
// flatMap(resolve, m) === m;
testEqual(flatMap(of, m), m);

const g = byFour;
// Associativity: m.bind(f).bind(g) === m.bind(x => f(x).bind(g))
// flatMap(g, flatMap(f, m)) === flatMap(x => flatMap(g, f(x)), m);
testEqual(flatMap(g, flatMap(f, m)), flatMap(x => flatMap(g, f(x)), m));
