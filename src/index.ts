import type { MethodKind } from "@bufbuild/protobuf";
import { ServiceType } from "@bufbuild/protobuf";
import { rest } from "msw";

type PromiseOr<T> = T | Promise<T>;

export const createMswConnectWeb = (baseUrl: string) => {
	return <S extends ServiceType, M extends Exclude<keyof S["methods"], symbol>>(
		service: S,
		method: M,
		handler: S["methods"][M]["kind"] extends MethodKind.Unary
			? (
					req: InstanceType<S["methods"][M]["I"]>,
			  ) => PromiseOr<InstanceType<S["methods"][M]["O"]>>
			: never,
	) => {
		type InputMessage = InstanceType<S["methods"][M]["I"]>;
		const methodInfo = service.methods[method];
		return rest.post(
			// https://github.com/bufbuild/connect-web/blob/a85b04b834112512df245a98768560e304717889/packages/connect-web/src/connect-transport.ts#L123
			baseUrl.replace(/\/?$/, `/${service.typeName}/${methodInfo.name}`),
			async (req, res, ctx) => {
				const reqJson = await req.json();
				const reqMessage = methodInfo.I.fromJson(reqJson);
				const resMessage = await handler(reqMessage as InputMessage);
				return res(ctx.json(resMessage.toJson()));
			},
		);
	};
};
