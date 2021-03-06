import { useState, useEffect } from "https://esm.sh/preact@10.8.1/hooks";
import { motor, MotorSpec } from "https://deno.land/x/motor/mod.ts";

export function useMotor<E extends string, G extends string>(
  machine: MotorSpec<G, E>
): {
  hook: (cylinder: (e: E) => void) => void;
  gear: () => G;
  fire: (event: E) => void;
  matches: (gear: G) => boolean;
} {
  const [{ fire, gear, hook, matches }, setShifter] = useState(
    motor<E, G>(machine)
  );
  const [fired, setFired] = useState<E[]>([""] as E[]);
  hook((e: E) => {
    setFired([...fired, e]);
  });
  useEffect(() => {
    const shift = motor<E, G>(machine);
    setShifter(shift);
    fired.forEach((e: E) => shift.fire(e));
  }, [fired]);
  return {
    matches,
    fire,
    gear,
    hook,
  };
}
