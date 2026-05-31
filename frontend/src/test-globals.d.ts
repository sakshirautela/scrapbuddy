declare const jest: {
  fn: () => unknown;
  mock: (moduleName: string, factory: () => unknown, options?: { virtual?: boolean }) => void;
};

declare const test: (name: string, testFn: () => void) => void;
declare const expect: (actual: unknown) => {
  toBeInTheDocument: () => void;
};
