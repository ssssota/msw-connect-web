# msw-connect-web

[Mock Service Worker](https://mswjs.io/) utility for [connect-web](https://github.com/bufbuild/connect-web).

Streaming request and response are currently **not** supported.

## Usage

Install package.

```sh
npm i -D msw-connect-web msw
```

Define mocks.

_handlers.ts_

```typescript
import { createMswConnectWeb } from 'msw-connect-web';
const connect = createMswConnectWeb({ baseUrl: 'https://...' });
export const handlers = [
  connect(YourService, 'methodName', async (req, res, ctx) => {
    // You can access the request message (with types) using the `message` method.
    const requestMessage = await req.message();
    return res(
      ctx.delay(1000),
      // You can define response with `message` method.
      ctx.message(new ResponseMessage({ ... })),
    );
  }),
];
```
