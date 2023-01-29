import { setupWorker } from "msw";
import { createMswConnectWeb } from "msw-connect-web";
import { baseUrl } from "./constants";
import { ElizaService } from "./gen/buf/connect/demo/eliza/v1/eliza_connectweb";
import { SayResponse } from "./gen/buf/connect/demo/eliza/v1/eliza_pb";

const connect = createMswConnectWeb({ baseUrl });

export const worker = setupWorker(
	connect(ElizaService, "say", async (req, res, ctx) => {
		const requestMessage = await req.message();
		return res(
			ctx.message(new SayResponse({ sentence: requestMessage.sentence })),
		);
	}),
);
