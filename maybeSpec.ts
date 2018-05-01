import { some, flatten, flatMap, Maybe, isSome } from './maybe';
import * as assert from 'assert';

function testEqual<T>(a: Maybe<T>, b: Maybe<T>): void {
  if (isSome(a) && isSome(b)) {
    assert(flatten(a) === flatten(b));
    console.log('test passed');
    return;
  }
  assert(false);
}

const byThree = (val: number): Maybe<number> => some(val * 3);
const byFour = (val: number): Maybe<number> => some(val * 4);

// monadic laws

const a = 3;
const f = byThree;
// Left identity: unit(a).bind(f) === f(a)
// flatMap(f, some(a)) === f(a);
testEqual(flatMap(f, some(a)), f(a));

const m = some(3);
// Right identity: m.bind(unit) === m;
// flatMap(resolve, m) === m;
testEqual(flatMap(some, m), m);

const g = byFour;
// Associativity: m.bind(f).bind(g) === m.bind(x => f(x).bind(g))
// flatMap(g, flatMap(f, m)) === flatMap(x => flatMap(g, f(x)), m);
testEqual(flatMap(g, flatMap(f, m)), flatMap(x => flatMap(g, f(x)), m));
