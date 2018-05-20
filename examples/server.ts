import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import * as Reader from '../reader';

const app = express();

interface Ctx {
  cid: string;
}

class ClientError extends Error {}

app.get('/', (req, res) => {
  const cid = req.header('x-cid');
  if (cid == undefined) {
    throw new ClientError('x-cid header unset');
  }
  const ctx: Ctx = { cid };
  const reader = Reader.doM(handler(res, req));
  Reader.run(ctx, reader);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ClientError) {
    res.status(400);
    res.json({ error: err.message });
  } else {
    throw err;
  }
});

function* handler(res: Response, req: Request) {
  const ctx: Ctx = yield Reader.ask();
  res.header('x-cid', ctx.cid);
  try {
    const str = yield* service(req);
    res.json({ str });
  } catch (err) {
    console.error('err: %s, cid: %s', err.message, ctx.cid);
    throw err;
  }
  return Reader.of(undefined);
}

function* service(req: Request) {
  const param = req.query['number'];
  if (param === undefined) {
    throw new ClientError('number param unset');
  }
  const num = parseInt(param, 10);
  if (isNaN(num)) {
    throw new ClientError('number param is not a number');
  }
  const result = yield* gateway(num);
  const mappedResult = yield* mapper(result);
  return mappedResult;
}

function* mapper(n: number) {
  const ctx: Ctx = yield Reader.ask();
  console.log('msg: %s, cid: %s', 'mapper', ctx.cid);
  return n.toString();
}

function* gateway(n: number) {
  const ctx: Ctx = yield Reader.ask();
  console.log('msg: %s, cid: %s', 'gateway', ctx.cid);
  if (n > 9) {
    throw new ClientError('number param is too big');
  }
  return n * 10;
}

app.listen(3000, () => console.log('listening on port 3000'));
