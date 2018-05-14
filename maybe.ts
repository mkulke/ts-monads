enum MaybeKind {
  Some,
  None,
}

interface Some<T> {
  readonly kind: MaybeKind.Some;
  readonly val: T;
}

interface None {
  readonly kind: MaybeKind.None;
}

type Maybe<T> = Some<T> | None;

function some<T>(val: T): Some<T> {
  return { kind: MaybeKind.Some, val };
}

function none(): None {
  return { kind: MaybeKind.None };
}

function isSome<T>(maybe: Maybe<T>): maybe is Some<T> {
  return maybe.kind === MaybeKind.Some;
}

function orElse<T>(elseMaybe: Maybe<T>, maybe: Maybe<T>): Maybe<T> {
  return isSome(maybe) ? maybe : elseMaybe;
}

function withDefault<T>(def: T, maybe: Maybe<T>): T {
  return isSome(maybe) ? maybe.val : def;
}

function flatMap<T, U>(fn: (val: T) => Maybe<U>, maybe: Maybe<T>): Maybe<U> {
  return isSome(maybe) ? fn(maybe.val) : none();
}

function map<T, U>(fn: (val: T) => U, maybe: Maybe<T>): Maybe<U> {
  return flatMap(x => some(fn(x)), maybe);
}

function flatten<T>(maybe: Maybe<Maybe<T>>): Maybe<T> {
  return flatMap(x => x, maybe);
}

export {
  Some,
  None,
  Maybe,
  isSome,
  some,
  none,
  orElse,
  withDefault,
  flatMap,
  map,
  flatten,
};
