import { createBirpc } from "birpc";
import { useEffect, useRef } from "react";
import type { BirpcOptions, BirpcReturn } from "birpc";

export function useRPCWorker<
  WorkerFunctions extends Record<string, never>,
  LocalFunctions extends object = Record<string, never>,
>(
  scriptURL: string | URL,
  localFunctions: LocalFunctions,
  options?: {
    rpc?: Omit<
      BirpcOptions<WorkerFunctions>,
      "post" | "on" | "serialize" | "deserialize"
    >;
    worker?: WorkerOptions;
  },
) {
  const rpc = useRef<BirpcReturn<WorkerFunctions, LocalFunctions>>(undefined);

  useEffect(() => {
    const worker = new Worker(scriptURL, options?.worker);

    rpc.current = createBirpc<WorkerFunctions, LocalFunctions>(localFunctions, {
      ...options?.rpc,
      post: (data) => worker.postMessage(data),
      on: (fn) => worker.addEventListener("message", fn),
      serialize: (data) => data,
      deserialize: (e) => e.data,
      off: (fn) => worker.removeEventListener("message", fn),
    });

    return () => {
      rpc.current?.$close();
    };
  }, []);

  return {
    rpc: rpc.current,
  };
}
