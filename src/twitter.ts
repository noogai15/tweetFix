import fetch from "node-fetch";

type MediaInfo = {
  type: string;
};

type Tweet = {
  media_extended: MediaInfo[];
};

export const checkIfVideo = async (link: string): Promise<boolean> => {
  let replacerPattern = new RegExp(
    "https?://(?:www\\.)?(twitter|x)\\.com/([^/]+/status/\\d+)(\\?s=20)?"
  );

  let apiLink = link.replace(replacerPattern, "https://api.vxtwitter.com/$2");
  console.log("🚀 ~ file: twitter.ts:13 ~ checkIfVideo ~ apiLink:", apiLink);
  const response = await fetch(apiLink);
  const info: Tweet = await response.json();
  if (!response.ok) {
    console.log("Couldn't get response");
    console.log(info);
    throw new Error("Couldn't get response");
  }
  let media = info.media_extended;
  if (!media.includes({ type: "video" } || !media.includes({ type: "gif" }))) return false;
  return true;
};
