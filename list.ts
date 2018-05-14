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

function isEmpty<T>(list: List<T>): list is Maybe.None {
  return !Maybe.isSome(list);
}

function head<T>(list: List<T>): Maybe.Maybe<T> {
  return Maybe.map(entry => entry.val, list);
}

function tail<T>(list: List<T>): Maybe.Maybe<List<T>> {
  return Maybe.map(entry => entry.next, list);
}

function concat<T>(b: List<T>, a: List<T>): List<T> {
  return Maybe.orElse(
    b,
    Maybe.map(entry => {
      const val = entry.val;
      const next = concat(b, entry.next);
      return { val, next };
    }, a),
  );
}

function clone<T>(list: List<T>): List<T> {
  return concat(Maybe.none(), list);
}

function append<T>(val: T, list: List<T>): List<T> {
  const entry = { val, next: Maybe.none() };
  return concat(Maybe.some(entry), list);
}

function toString<T>(list: List<T>): string {
  const maybe = Maybe.map(
    entry =>
      isEmpty(entry.next)
        ? `${entry.val}`
        : `${entry.val}, ${toString(entry.next)}`,
    list,
  );
  return Maybe.withDefault('', maybe);
}

function flatMap2<T, U>(fn: (val: T) => List<U>, list: List<T>): List<U> {
  if (isEmpty(list)) {
    return list;
  }

  const entry = list.val;
  const innerList = fn(entry.val);
  const mgns = flatMap2(fn, entry.next);
  return concat(innerList, mgns);
}

function flatMap<T, U>(fn: (val: T) => List<U>, list: List<T>): List<U> {
  return flatten(map(fn, list));
}

function map<T, U>(fn: (val: T) => U, list: List<T>): List<U> {
  return Maybe.map(entry => {
    const val = fn(entry.val);
    const next = map(fn, entry.next);
    return { val, next };
  }, list);
}

function flatten<T>(list: List<List<T>>): List<T> {
  return Maybe.flatMap(entry => {
    const innerList = entry.val;
    const next = entry.next;
    return concat(flatten(next), innerList);
  }, list);
}

export {
  List,
  map,
  flatMap,
  flatMap2,
  flatten,
  concat,
  append,
  head,
  tail,
  of,
  clone,
  empty,
  isEmpty,
  toString,
};
