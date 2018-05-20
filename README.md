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

## examples

### reader

provide request context in web service layers via reader monad and iterator functions.

```bash
node dist/examples/server.js
```

```bash
curl "http://localhost:3000?number=9" -H "X-Cid: 123"
```

## test

```bash
find dist/*Spec.js -exec node {} \;
```
