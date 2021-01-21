declare module 'event-target-shim' {
  const target: typeof EventTarget;
  const event: typeof Event;
  export { target as EventTarget, event as Event };
}
