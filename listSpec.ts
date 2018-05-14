import {
  concat,
  List,
  flatMap,
  flatMap2,
  isEmpty,
  head,
  of,
  tail,
  toString,
} from './list';
import * as Maybe from './maybe';
import * as assert from 'assert';

function testEqual<T>(a: List<T>, b: List<T>): void {
  if (isEmpty(a) && isEmpty(b)) {
    console.log('test passed');
    return;
  }

  if (isEmpty(a) || isEmpty(b)) {
    assert(false);
    return;
  }

  const x = Maybe.flatten(a);
  const y = Maybe.flatten(b);
  // console.log('mgns %j %j', x.val, y.val);
  assert(x.val === y.val);
  return testEqual(x.next, y.next);
}

const byThree = (val: number): List<number> => of(val * 3);
const byFour = (val: number): List<number> => of(val * 4);

// monadic laws

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

const x = of(2);
const y = of(3);
const z = concat(x, y);
// print(c);
// const c_c = concat(of(c), empty());
// print(flatten(c_c));
// const b = of(3);
// const c = concat(b, a);
console.log('mgns %s', toString(flatMap2(u => concat(of(u + 1), of(u)), z)));
// print(c);
// const d = of(true);
// const e = concat<number | boolean>(c, d);
