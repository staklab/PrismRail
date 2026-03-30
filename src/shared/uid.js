export function simpleHash(input) {
  const value = String(input ?? "");
  let hash = 5381;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33) ^ value.charCodeAt(index);
  }

  return (hash >>> 0).toString(36);
}

export function buildMessageId(site, role, order, text) {
  return `${site}-${role}-${order}-${simpleHash(text).slice(0, 7)}`;
}
