import * as Maybe from './maybe';

interface Entry<T> {
  readonly val: T;
  readonly next: Maybe.Maybe<Entry<T>>;
}

type List<T> = Maybe.Maybe<Entry<T>>;

function of<T>(val: T): List<T> {
  return Maybe.some({ val, next: Maybe.none() });
}

function empty<T>(): List<T> {
  return Maybe.none();
}

function head<T>(list: List<T>): Maybe.Maybe<T> {
  return Maybe.map(entry => entry.val, list);
}

function tail<T>(list: List<T>): Maybe.Maybe<List<T>> {
  return Maybe.map(entry => entry.next, list);
}

function concat<T>(b: List<T>, a: List<T>): List<T> {
  if (!Maybe.isSome(a)) {
    return b;
  }

  const entry = a.val;
  const next = concat(b, entry.next);
  return Maybe.some({ ...entry, next });
}

function clone<T>(list: List<T>): List<T> {
  return concat(Maybe.none(), list);
}

function append<T>(val: T, list: List<T>): List<T> {
  const entry = { val, next: Maybe.none() };
  return concat(Maybe.some(entry), list);
}

function toString<T>(list: List<T>): string {
  if (!Maybe.isSome(list)) {
    return '';
  }

  const entry = list.val;
  if (!Maybe.isSome(entry.next)) {
    return `${entry.val}`;
  }

  return `${entry.val}, ${toString(entry.next)}`;
}

function print<T>(list: List<T>): void {
  if (!Maybe.isSome(list)) {
    return;
  }

  const entry = list.val;
  console.log(entry.val);
  print(entry.next);
}

function map<T, U>(fn: (val: T) => U, list: List<T>): List<U> {
  return Maybe.map(entry => {
    const val = fn(entry.val);
    const next = map(fn, entry.next);
    return { val, next };
  }, list);
}

function flatMap<T, U>(fn: (val: T) => List<U>, list: List<T>): List<U> {
  return flatten(map(fn, list));
}

function flatten<T>(list: List<List<T>>): List<T> {
  return Maybe.flatMap(entry => {
    const innerList = entry.val;
    const next = entry.next;
    return concat(flatten(next), innerList);
  }, list);
}

const a = of(2);
const b = of(3);
const c = concat(b, a);
// print(c);
// const c_c = concat(of(c), empty());
// print(flatten(c_c));
// const b = of(3);
// const c = concat(b, a);
console.log('mgns %s', toString(flatMap(x => concat(of(x + 1), of(x)), c)));
// print(c);
// const d = of(true);
// const e = concat<number | boolean>(c, d);
