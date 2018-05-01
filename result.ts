enum ResultKind {
  Ok,
  Err,
}

interface Ok<T> {
  kind: ResultKind.Ok;
  val: T;
}

interface Err {
  kind: ResultKind.Err;
  err: Error;
}

type Result<T> = Ok<T> | Err;

function ok<T>(val: T): Ok<T> {
  return { kind: ResultKind.Ok, val };
}

function err(err: Error): Err {
  return { kind: ResultKind.Err, err };
}

function isOk<T>(val: Result<T>): val is Ok<T> {
  return val.kind === ResultKind.Ok;
}

function flatMap<T, U>(fn: (val: T) => Result<U>, res: Result<T>): Result<U> {
  return isOk(res) ? fn(flatten(res)) : res;
}

function map<T, U>(fn: (val: T) => U, res: Result<T>): Result<U> {
  return isOk(res) ? ok(fn(flatten(res))) : res;
}

function flatten<T>(ok: Ok<T>): T {
  return ok.val;
}

export { Result, map, flatMap, flatten, isOk, ok, err };
