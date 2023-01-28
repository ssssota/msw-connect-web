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
  connect(YourService, 'methodName', async (req: MethodRequest) => {
    // mock response
    return new MethodResponse({ ... });
  });
];
```
