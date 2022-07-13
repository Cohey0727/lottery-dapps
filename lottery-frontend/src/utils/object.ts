export function objectKeys<K extends number | string | symbol>(
  obj: Record<K, any>
): K[] {
  return Object.keys(obj) as K[];
}

export function objectEntries<K extends number | string | symbol, V>(
  obj: Record<K, V>
) {
  return Object.entries(obj) as [K, V][];
}
