export const lazyLoad = (
  importFn: () => Promise<{ default: React.ComponentType<unknown> }>
) => {
  return async () => {
    const module = await importFn();
    return { Component: module.default };
  };
};
