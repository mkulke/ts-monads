type Program<U, S> = (v: S) => [U, S]; // S being state here.

function flatMap<U, V, S>(
  fn: (val: U) => Program<V, S>,
  program: Program<U, S>,
): Program<V, S> {
  return (state: S) => {
    const [result, newState] = program(state);
    const newProgram = fn(result);
    return newProgram(newState);
  };
}

function map<U, V, S>(
  fn: (val: U) => V,
  program: Program<U, S>,
): Program<V, S> {
  return flatMap(x => of(fn(x)), program);
}

function of<U, S>(u: U): (s: S) => [U, S] {
  return (state: S) => [u, state];
}

export { Program, map, flatMap, of };
