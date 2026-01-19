export const isNextjs = (): boolean =>
  // https://stackoverflow.com/a/74462617
  window && 'next' in window
