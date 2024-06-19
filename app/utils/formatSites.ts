export function formatSites(sites: string): RegExpMatchArray | [] {
  const regex = /((https|http):\/\/)?(w{3}.)?(\/$)?/gm;
  const sitesReplaced = sites.replace(regex, "");

  const response = sitesReplaced?.match(/[^\r\n]+/gm) ?? [];

  return response;
}
