import { setupWorker } from "msw";
import { createMswConnectWeb } from "msw-connect-web";
import { baseUrl } from "./constants";
import { ElizaService } from "./gen/buf/connect/demo/eliza/v1/eliza_connectweb";
import { SayResponse } from "./gen/buf/connect/demo/eliza/v1/eliza_pb";

const connect = createMswConnectWeb(baseUrl);

export const worker = setupWorker(
	connect(ElizaService, "say", (req) => {
		return new SayResponse({ sentence: req.sentence });
	}),
);
