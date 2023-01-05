import fetch from "node-fetch";
import { URL } from "url";

type TwitterMedia = {
  type: string;
};

type TwitterVideoResponse = {
  includes?: {
    media: TwitterMedia[];
  };
};

export const checkIfVideo = async (link: string): Promise<boolean> => {
  let url = new URL(link);
  let tweetID = url.pathname.split("/").pop();
  let apiLink = `https://api.twitter.com/2/tweets/${tweetID}?media.fields=type&expansions=attachments.media_keys`;
  const response = await fetch(apiLink, {
    headers: {
      Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
    },
  });
  const data: TwitterVideoResponse = await response.json();
  if (!response.ok) {
    console.log("Couldn't get response");
    console.log(data);
    throw new Error("Couldn't get response");
  }

  if (!data.includes?.media) return false;
  const mediaType = data.includes.media[0].type;

  console.log("Found Twitter url: " + apiLink);
  if (!mediaType) {
    console.log("Could not get type of media from the tweet");
    return false;
  }

  console.log("The media in this tweet is of type: " + mediaType.toUpperCase());

  return mediaType == "video" || mediaType == "animated_gif";
};
