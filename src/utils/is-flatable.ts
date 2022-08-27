export const isFlatable = (arg: any) => {
  return arg !== null && arg !== undefined && Boolean(arg[Symbol.iterator]);
};
