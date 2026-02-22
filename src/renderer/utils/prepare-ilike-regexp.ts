export function prepareILikeRegexp(pattern: string): RegExp {
  const escaped = pattern.replace(/[-\/\\^$+?.()|[\]{}]/g, '\\$&');

  const regexpPattern = `^${escaped.replace(/%/g, '.*')}$`;

  return new RegExp(regexpPattern, 'i');
}
