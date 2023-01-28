import type { MethodKind } from "@bufbuild/protobuf";
import { ServiceType } from "@bufbuild/protobuf";
import { ResponseComposition, rest, RestContext, RestRequest } from "msw";

type PromiseOr<T> = T | Promise<T>;

export const createMswConnectWeb = (baseUrl: string) => {
	return <S extends ServiceType, M extends Exclude<keyof S["methods"], symbol>>(
		service: S,
		method: M,
		handler: S["methods"][M]["kind"] extends MethodKind.Unary
			? (
					req: RestRequest & { message(): InstanceType<S["methods"][M]["I"]> },
					res: ResponseComposition,
					ctx: RestContext & {
						message(
							msg: InstanceType<S["methods"][M]["O"]>,
						): RestContext["json"];
					},
			  ) => PromiseOr<ReturnType<ResponseComposition>>
			: never,
	) => {
		const methodInfo = service.methods[method];
		return rest.post(
			// https://github.com/bufbuild/connect-web/blob/a85b04b834112512df245a98768560e304717889/packages/connect-web/src/connect-transport.ts#L123
			baseUrl.replace(/\/?$/, `/${service.typeName}/${methodInfo.name}`),
			async (req, res, ctx) => {
				type HandlerArgs = Parameters<typeof handler>;
				const exReq = new Proxy(req, {
					get(target, p, receiver) {
						if (p === "message") {
							return () => target.json().then((j) => methodInfo.I.fromJson(j));
						}
						return Reflect.get(target, p, receiver);
					},
				}) as HandlerArgs[0];
				const exCtx = new Proxy(ctx, {
					get(target, p, receiver) {
						if (p === "message") {
							return (msg: InstanceType<S["methods"][M]["O"]>) => {
								return ctx.json(msg.toJson());
							};
						}
						return Reflect.get(target, p, receiver);
					},
				}) as HandlerArgs[2];
				return handler(exReq, res, exCtx);
			},
		);
	};
};
