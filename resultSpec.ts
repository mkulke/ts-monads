import { ok, flatten, flatMap, Result, isOk } from './result';
import * as assert from 'assert';

function testEqual<T>(a: Result<T>, b: Result<T>): void {
  if (isOk(a) && isOk(b)) {
    assert(a.val === b.val);
    console.log('test passed');
    return;
  }
  assert(false);
}

const byThree = (val: number): Result<number> => ok(val * 3);
const byFour = (val: number): Result<number> => ok(val * 4);

// monadic laws

const a = 3;
const f = byThree;
// Left identity: unit(a).bind(f) === f(a)
// flatMap(f, some(a)) === f(a);
testEqual(flatMap(f, ok(a)), f(a));

const m = ok(3);
// Right identity: m.bind(unit) === m;
// flatMap(resolve, m) === m;
testEqual(flatMap(ok, m), m);

const g = byFour;
// Associativity: m.bind(f).bind(g) === m.bind(x => f(x).bind(g))
// flatMap(g, flatMap(f, m)) === flatMap(x => flatMap(g, f(x)), m);
testEqual(flatMap(g, flatMap(f, m)), flatMap(x => flatMap(g, f(x)), m));
