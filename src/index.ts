import "dotenv/config";
import * as Discord from "discord.js";
import { URL } from "url";
import fetch from "node-fetch";

const client = new Discord.Client();

process.on("uncaughtException", (err) => {
  console.error(err);
  if (!process.env.BOT_OWNER_ID) {
    throw Error("missing bot owner id");
  }
  client.users.cache
    .get(process.env.BOT_OWNER_ID)
    ?.send("Bot crashed.\nError: " + err)
    .then(() => process.exit(1))
    .catch(() => console.log("Message failed to send to Bot owner"));
});

process.on("unhandledRejection", (err) => {
  console.error(err);

  if (!process.env.BOT_OWNER_ID) {
    throw Error("missing bot owner id");
  }

  client.users.cache
    .get(process.env.BOT_OWNER_ID)
    ?.send("Bot crashed.\nError: " + err)
    .then((message) => process.exit(1))
    .catch(() => console.log("Message failed to send to Bot owner"));
});

const urlRegex =
  /((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi;

const twitterUrls = ["http://twitter.com/", "https://twitter.com/"];

client.on("ready", () => {
  console.log("Started TwitFix");
  console.log("Username: " + client.user!.username);
});

function getURL(string: string) {
  let urlMatches = string.match(urlRegex);
  if (urlMatches == null) {
    return;
  }
  return urlMatches[0];
}

client.on("message", async (message) => {
  if (message.author.bot) {
    return;
  }
  let url = getURL(message.content);
  if (!url) {
    return;
  }
  const linkUrl = url;

  const hasValidTwitterLink = twitterUrls.some(
    (twitterUrl) => linkUrl.includes(twitterUrl) && linkUrl.includes("status")
  );

  const isVideo = await checkIfVideo(url);

  if (hasValidTwitterLink && isVideo) {
    let fixedLink = url.replace(/twitter/gm, "fxtwitter");
    message.reply(fixedLink);
  }
});

type TwitterMedia = {
  type: string;
};

type TwitterVideoResponse = {
  includes: {
    media: TwitterMedia[];
  };
};

const checkIfVideo = async (link: string): Promise<boolean> => {
  let url = new URL(link);
  let tweetID = url.pathname.split("/").pop();
  let apiLink = `https://api.twitter.com/2/tweets/${tweetID}?media.fields=type&expansions=attachments.media_keys`;
  const response = await fetch(apiLink, {
    headers: {
      Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
    },
  });
  if (!response.ok) return false;

  const data: TwitterVideoResponse = await response.json();
  const mediaType = data.includes.media[0].type;

  console.log("Found Twitter url: " + apiLink);
  if (!mediaType) {
    console.log("Could not get type of media from the tweet");
    return false;
  }

  console.log("The media in this tweet is of type: " + mediaType.toUpperCase());

  return mediaType == "video";
};

client.login(process.env.BOT_TOKEN);
