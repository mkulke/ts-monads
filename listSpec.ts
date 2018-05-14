import {
  clone,
  concat,
  empty,
  flatten,
  List,
  flatMap,
  isEmpty,
  head,
  map,
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
  assert(x.val === y.val);
  return testEqual(x.next, y.next);
}

const x = of(2);
const y = of(3);
const z = concat(y, x);

// clone
testEqual(z, clone(z));

// head
testEqual(Maybe.flatMap(of, head(z)), x);
testEqual(Maybe.flatMap(of, head(empty())), empty());

// tail
testEqual(tail(concat(z, x)), z);
testEqual(tail(x), empty());

// map
testEqual(map(x => x * x, z), concat(of(9), of(4)));

// flatten
testEqual(flatten(of(z)), z);
testEqual(flatten(concat(of(z), of(x))), concat(z, x));

// monadic laws

const byThree = (val: number): List<number> => of(val * 3);
const byFour = (val: number): List<number> => of(val * 4);

const a = 3;
const f = byThree;
// Left identity: unit(a).bind(f) === f(a)
// flatMap(f, of(a)) === f(a);
testEqual(flatMap(f, of(a)), f(a));

const m = of(3);
// Right identity: m.bind(unit) === m;
// flatMap(of, m) === m;
testEqual(flatMap(of, m), m);

const g = byFour;
// Associativity: m.bind(f).bind(g) === m.bind(x => f(x).bind(g))
// flatMap(g, flatMap(f, m)) === flatMap(x => flatMap(g, f(x)), m);
testEqual(flatMap(g, flatMap(f, m)), flatMap(x => flatMap(g, f(x)), m));

// const x = of(2);
// const y = of(3);
// const z = concat(x, y);
// print(c);
// const c_c = concat(of(c), empty());
// print(flatten(c_c));
// const b = of(3);
// const c = concat(b, a);
console.log('mgns %s', toString(map(u => u > 2, z)));
console.log('mgns %s', toString(flatMap(u => concat(of(u + 1), of(u)), z)));
// print(c);
// const d = of(true);
// const e = concat<number | boolean>(c, d);
