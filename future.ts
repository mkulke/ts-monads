type ResolveFn<T> = (t: T) => void;
type RejectFn<T> = ResolveFn<T>;
type FutureFn<T, U> = (rj: RejectFn<T>, rs: ResolveFn<U>) => void;
interface Future<T, U> {
  fn: FutureFn<T, U>;
}

function future<T, U>(fn: FutureFn<T, U>): Future<T, U> {
  return { fn };
}

function resolve<T, U>(val: U): Future<T, U> {
  return future((_rj, rs) => rs(val));
}

function reject<T, U>(val: T): Future<T, U> {
  return future((rj, _rs) => rj(val));
}

function fork<T, U>(
  rj: RejectFn<T>,
  rs: ResolveFn<U>,
  future: Future<T, U>,
): void {
  future.fn(rj, rs);
}

function map<T, U, V>(fn: (val: U) => V, fut: Future<T, U>): Future<T, V> {
  return flatMap(x => resolve(fn(x)), fut);
}

function flatMap<T, U, V>(
  fn: (val: U) => Future<T, V>,
  fut: Future<T, U>,
): Future<T, V> {
  return future((rj, rs) => fut.fn(rj, val => fork(rj, rs, fn(val))));
}

function flatten<T, U>(fut: Future<T, Future<T, U>>): Future<T, U> {
  return flatMap(x => x, fut);
}

export { Future, flatten, flatMap, fork, future, map, reject, resolve };
