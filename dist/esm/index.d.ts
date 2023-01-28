import type { MethodKind } from "@bufbuild/protobuf";
import { ServiceType } from "@bufbuild/protobuf";
type PromiseOr<T> = T | Promise<T>;
export declare const createMswConnectWeb: (baseUrl: string) => <S extends ServiceType, M extends Exclude<keyof S["methods"], symbol>>(service: S, method: M, handler: S["methods"][M]["kind"] extends MethodKind.Unary ? (req: InstanceType<S["methods"][M]["I"]>) => PromiseOr<InstanceType<S["methods"][M]["O"]>> : never) => import("msw").RestHandler<import("msw/lib/glossary-de6278a9").M<import("msw/lib/glossary-de6278a9").h>>;
export {};
