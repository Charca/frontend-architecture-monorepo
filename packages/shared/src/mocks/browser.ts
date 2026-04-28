import { setupWorker } from "msw/browser";
import { handlers } from "@commerceos/shared/mocks/handlers";

export const worker = setupWorker(...handlers);
