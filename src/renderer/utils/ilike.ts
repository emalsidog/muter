export function ilike(str: string, pattern: string) {
  // Escape regex special characters except for %
  const escaped = pattern.replace(/[-\/\\^$+?.()|[\]{}]/g, '\\$&');

  // Replace SQL wildcard % with regex wildcard .*
  const regexPattern = `^${escaped.replace(/%/g, '.*')}$`;

  // Create regex with case-insensitive flag
  const regex = new RegExp(regexPattern, 'i');

  return regex.test(str);
}
