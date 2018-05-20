type ComputationFn<C, T> = (c: C) => T;

interface Reader<C, T> {
  readonly fn: ComputationFn<C, T>;
}

function reader<T, U>(fn: ComputationFn<T, U>): Reader<T, U> {
  return { fn };
}

function of<T>(val: T): Reader<{}, T> {
  return reader(() => val);
}

function run<C, T>(ctx: C, reader: Reader<C, T>): T {
  return reader.fn(ctx);
}

function map<C, T, U>(fn: (t: T) => U, rdr: Reader<C, T>): Reader<C, U> {
  return flatMap(x => of(fn(x)), rdr);
}

function flatMap<C, T, U>(
  fn: (t: T) => Reader<C, U>,
  rdr: Reader<C, T>,
): Reader<C, U> {
  return reader(ctx => run(ctx, fn(rdr.fn(ctx))));
}

function flatten<T, U>(rdr: Reader<T, Reader<T, U>>): Reader<T, U> {
  return flatMap(x => x, rdr);
}

function ask<T>(): Reader<T, T> {
  return reader(x => x);
}

function doM<C, T>(it: IterableIterator<Reader<C, T>>): Reader<C, T> {
  const step = (val?: T): Reader<C, T> => {
    const { done, value } = it.next(val);
    return done ? value : flatMap(step, value);
  };
  return step();
}

export { Reader, flatten, flatMap, run, reader, map, of, ask, doM };
