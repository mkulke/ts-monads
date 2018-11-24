import { of, flatMap, map, Program } from './state';
import * as assert from 'assert';

function testEqual<T>(a: Program<T, any>, b: Program<T, any>): void {
  const [aVal] = a(true);
  const [bVal] = b(true);
  assert(aVal === bVal);
  console.log('test passed');
}

// monadic laws

const a = 'abc';
const f = (a: string) => of(a + a);
// Left identity: unit(a).bind(f) === f(a)
// flatMap(f, of(a)) === f(a);
testEqual(flatMap(f, of(a)), f(a));

const m = of('123');
// Right identity: m.bind(unit) === m;
// flatMap(resolve, m) === m;
testEqual(flatMap(of, m), m);

const g = (a: string) => of(a.length);
// Associativity: m.bind(f).bind(g) === m.bind(x => f(x).bind(g))
// flatMap(g, flatMap(f, m)) === flatMap(x => flatMap(g, f(x)), m);
testEqual(flatMap(g, flatMap(f, m)), flatMap(x => flatMap(g, f(x)), m));
