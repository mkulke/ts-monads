import { of, flatMap, map, Program } from '../state';

type State = number[];
type Calc = Program<number, State>;

function pushCalc(n: number): Calc {
  return (stack: State) => [0, [n, ...stack]];
}

function addCalc(): Calc {
  return (stack: State) => {
    const [a, b, ...rest] = stack;
    return [0, [a + b, ...rest]];
  };
}

function popCalc(): Calc {
  return (stack: State) => {
    const [a, ...rest] = stack;
    return [a, rest];
  };
}

const ma = pushCalc(10);
const mb = flatMap(() => pushCalc(15), ma);
const mc = flatMap(() => addCalc(), mb);
const md = flatMap(() => popCalc(), mc);

class StateMonad<U, S> {
  constructor(public program: Program<U, S>) {}

  flatMap<V>(fn: (val: U) => Program<V, S>): StateMonad<V, S> {
    return new StateMonad(flatMap(fn, this.program));
  }

  map<V>(fn: (val: U) => V): StateMonad<V, S> {
    return this.flatMap(x => of(fn(x)));
  }
}

function box<T>(value: T): Record<'value', T> {
  return { value };
}

const p = new StateMonad(pushCalc(10))
  .flatMap(() => pushCalc(15))
  .flatMap(() => addCalc())
  .flatMap(() => popCalc())
  .map(box);

const [v, _] = p.program([]);
console.log(v);
