export const isIgnorableString = ({
  stringIgnore = true,
  current,
}: {
  stringIgnore: boolean;
  current: unknown;
}) =>
  typeof current === 'string' && (stringIgnore || current.length < 2 || current === '[Circular]');
