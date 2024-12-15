import { createBirpc } from "birpc";
import { useEffect, useRef } from "react";
import type { BirpcOptions, BirpcReturn } from "birpc";

export function useRPCWorker<
  RemoteFunctions extends Record<string, never>,
  LocalFunctions extends Record<string, never>,
>(
  scriptURL: string | URL,
  localFunctions: LocalFunctions,
  options?: {
    rpc?: Omit<
      BirpcOptions<RemoteFunctions>,
      "post" | "on" | "serialize" | "deserialize"
    >;
    worker?: WorkerOptions;
  },
) {
  const rpc = useRef<BirpcReturn<RemoteFunctions, LocalFunctions>>(undefined);

  useEffect(() => {
    const worker = new Worker(scriptURL, options?.worker);

    rpc.current = createBirpc<RemoteFunctions, LocalFunctions>(localFunctions, {
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
