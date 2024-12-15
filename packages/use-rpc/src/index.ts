import { createBirpc } from "birpc";
import { useEffect, useRef } from "react";
import type { BirpcOptions, BirpcReturn } from "birpc";

export function useRPC<
  RemoteFunctions extends Record<string, never>,
  LocalFunctions extends Record<string, never>,
>(localFunctions: LocalFunctions, options: BirpcOptions<RemoteFunctions>) {
  const rpc = useRef<BirpcReturn<RemoteFunctions, LocalFunctions>>(undefined);

  useEffect(() => {
    rpc.current = createBirpc<RemoteFunctions, LocalFunctions>(
      localFunctions,
      options,
    );

    return () => {
      rpc.current?.$close();
    };
  }, []);

  return {
    rpc: rpc.current,
  };
}
