enum MaybeKind {
  Some,
  None,
}

interface Some<T> {
  kind: MaybeKind.Some;
  val: T;
}

interface None {
  kind: MaybeKind.None;
}

type Maybe<T> = Some<T> | None;

function some<T>(val: T): Maybe<T> {
  return { kind: MaybeKind.Some, val };
}

function none(): None {
  return { kind: MaybeKind.None };
}

function isSome<T>(maybe: Maybe<T>): maybe is Some<T> {
  return maybe.kind === MaybeKind.Some;
}

function withDefault<T>(maybe: Maybe<T>, def: T): T {
  return isSome(maybe) ? flatten(maybe) : def;
}

function flatMap<T, U>(fn: (val: T) => Maybe<U>, maybe: Maybe<T>): Maybe<U> {
  return isSome(maybe) ? fn(flatten(maybe)) : maybe;
}

function map<T, U>(fn: (val: T) => U, maybe: Maybe<T>): Maybe<U> {
  return isSome(maybe) ? some(fn(flatten(maybe))) : maybe;
}

function flatten<T>(some: Some<T>): T {
  return some.val;
}

export { Some, Maybe, isSome, some, none, withDefault, flatMap, map, flatten };
