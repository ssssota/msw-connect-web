import type { MethodKind, ServiceType } from "@bufbuild/protobuf";
import {
	ResponseComposition,
	ResponseTransformer,
	rest,
	RestContext,
	RestHandler,
	RestRequest,
} from "msw";

type PromiseOr<T> = T | Promise<T>;

export type Options = {
	baseUrl: string;
};

type CreateMswConnectWeb = (options: Options) => <
	S extends ServiceType,
	M extends Exclude<keyof S["methods"], symbol>,
>(
	service: S,
	method: M,
	handler: S["methods"][M]["kind"] extends MethodKind.Unary
		? (
				req: RestRequest & {
					message(): Promise<InstanceType<S["methods"][M]["I"]>>;
				},
				res: ResponseComposition,
				ctx: RestContext & {
					message(msg: InstanceType<S["methods"][M]["O"]>): ResponseTransformer;
				},
		  ) => PromiseOr<ReturnType<ResponseComposition>>
		: never,
) => RestHandler;

export const createMswConnectWeb: CreateMswConnectWeb = ({ baseUrl }) => {
	return (service, method, handler) => {
		const methodInfo = service.methods[method];
		return rest.post(
			// https://github.com/bufbuild/connect-web/blob/a85b04b834112512df245a98768560e304717889/packages/connect-web/src/connect-transport.ts#L123
			baseUrl.replace(/\/?$/, `/${service.typeName}/${methodInfo.name}`),
			async (req, res, ctx) => {
				type HandlerArgs = Parameters<typeof handler>;
				type ExReq = HandlerArgs[0];
				type ExCtx = HandlerArgs[2];
				const exReq = new Proxy(req, {
					get(target, p, receiver) {
						if (p === "message") {
							return () => target.json().then(methodInfo.I.fromJson);
						}
						return Reflect.get(target, p, receiver);
					},
				}) as ExReq;
				const exCtx = new Proxy(ctx, {
					get(target, p, receiver) {
						if (p === "message") {
							return ((msg) => {
								return ctx.json(msg.toJson());
							}) satisfies ExCtx["message"];
						}
						return Reflect.get(target, p, receiver);
					},
				}) as ExCtx;
				return handler(exReq, res, exCtx);
			},
		);
	};
};
