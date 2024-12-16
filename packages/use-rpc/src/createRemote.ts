import { createBirpc } from "birpc";
import type { BirpcOptions } from "birpc";

export function createRemote<
  LocalFunctions extends Record<string, never>,
  WorkerFunctions extends object = Record<string, never>,
>(
  functions: WorkerFunctions,
  birpcOptions:
    | BirpcOptions<LocalFunctions>
    | (() => BirpcOptions<LocalFunctions>),
) {
  const options =
    typeof birpcOptions === "function" ? birpcOptions() : birpcOptions;

  const rpc = createBirpc<LocalFunctions, WorkerFunctions>(functions, options);

  return rpc;
}
