export const normalizeAttachmentUrl = value => {
  if (!value) return "";

  const url = String(value).trim();
  const httpMatches = [...url.matchAll(/https?:\/\//g)];
  const lastHttpIndex = httpMatches.at(-1)?.index ?? -1;

  if (lastHttpIndex > 0) {
    return url.slice(lastHttpIndex);
  }

  return url;
};
