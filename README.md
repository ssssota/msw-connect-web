# msw-connect-web

[Mock Service Worker](https://mswjs.io/) utility for [connect-web](https://github.com/bufbuild/connect-web).

🚧 Streaming requests and responses are not currently supported.

🚧 And server-side mocking is currently not supported either. (Because MSW has no support for Node.js `globalThis.fetch`. [mswjs/interceptors#283](https://github.com/mswjs/interceptors/pull/283))

If you want to mock on the server-side, you can use [connect-web-mock-interceptor](https://www.npmjs.com/package/connect-web-mock-interceptor).

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
