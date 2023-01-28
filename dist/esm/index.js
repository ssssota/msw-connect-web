import { rest } from "msw";
export const createMswConnectWeb = (baseUrl) => {
    return (service, method, handler) => {
        const methodInfo = service.methods[method];
        return rest.post(
        // https://github.com/bufbuild/connect-web/blob/a85b04b834112512df245a98768560e304717889/packages/connect-web/src/connect-transport.ts#L123
        baseUrl.replace(/\/?$/, `/${service.typeName}/${methodInfo.name}`), async (req, res, ctx) => {
            const reqJson = await req.json();
            const reqMessage = methodInfo.I.fromJson(reqJson);
            const resMessage = await handler(reqMessage);
            return res(ctx.json(resMessage.toJson()));
        });
    };
};
