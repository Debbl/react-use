/* eslint-disable no-restricted-globals */
import { createRemote } from "use-rpc";
import type { BirpcOptions } from "birpc";

export function createWorker<
  LocalFunctions extends object = Record<string, never>,
  WorkerFunctions extends object = Record<string, never>,
>(
  functions: WorkerFunctions,
  options?: Omit<
    BirpcOptions<LocalFunctions>,
    "post" | "on" | "serialize" | "deserialize"
  >,
) {
  const rpc = createRemote<LocalFunctions, WorkerFunctions>(functions, {
    ...options,
    post: (data) => self.postMessage(data),
    on: (fn) => self.addEventListener("message", fn),
    serialize: (data) => data,
    deserialize: (e) => e.data,
    off: (fn) => self.removeEventListener("message", fn),
  });

  return rpc;
}
