/** Compile-time guard: call in `default` after exhaustive `switch` on a union. */
export function assertNever(value: never, message?: string): never {
  throw new Error(message ?? `Unexpected value: ${String(value)}`);
}
