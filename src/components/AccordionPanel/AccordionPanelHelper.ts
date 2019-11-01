export const getShouldExpanded = (expanded: Map<string, string>, name: string) =>
  !!expanded.get(name)
