# ts-monads

* several monads, written in typescript
* very barebone, for exploration around types
* do not use for anything
* maybe, list, result, future & reader

## install & compile

```bash
npm i
$(npm bin)/tsc
```

## usage

```typescript
import { Future, future, map, flatMap, fork } from './future';

const one: Future<Error, number> = future((_rej, res) => {
  setTimeout(() => res(10), 1000);
});

const byThree = (val: number): Future<Error, number> =>
  future((_rej, res) => {
    setTimeout(() => res(val * 3), 300);
  });

const two = map(x => x * 2, one);
const three = flatMap(byThree, two);
fork(console.error, console.log, three);
```

## test

```bash
find dist/*Spec.js -exec node {} \;
```
