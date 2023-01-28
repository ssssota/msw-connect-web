import {
	createConnectTransport,
	createPromiseClient,
} from "@bufbuild/connect-web";
import { baseUrl } from "./constants";
import { ElizaService } from "./gen/buf/connect/demo/eliza/v1/eliza_connectweb";
import { worker } from "./mocks";

const transport = createConnectTransport({ baseUrl });
const eliza = createPromiseClient(ElizaService, transport);
worker.start();

const output = document.createElement("pre");
output.role = "log";
document.body.appendChild(output);

const sayButton = document.createElement("button");
sayButton.textContent = "say";
sayButton.addEventListener("click", async () => {
	const res = await eliza.say({ sentence: "Test" });
	output.textContent = res.sentence;
});
document.body.appendChild(sayButton);
