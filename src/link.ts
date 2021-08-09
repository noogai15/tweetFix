const twitterUrls = ["http://twitter.com/", "https://twitter.com/"];

export function hasValidTwitterLink(url: string): boolean {
  return twitterUrls.some(
    (twitterUrl) => url.includes(twitterUrl) && url.includes("status")
  );
}
