require("dotenv/config");
const Discord = require("discord.js");
const { URL } = require("url");
const fetch = require("node-fetch");
const client = new Discord.Client();

process.on("uncaughtException", (err) => {
  client.users.cache
    .get(process.env.BOT_OWNER_ID)
    .send("Bot crashed.\nError: " + err)
    .then((message) => process.exit(1))
    .catch(console.log("Message failed to send to Bot owner"));
});

process.on("unhandledRejection", (err) => {
  client.users.cache
    .get(process.env.BOT_OWNER_ID)
    .send("Bot crashed.\nError: " + err)
    .then((message) => process.exit(1))
    .catch(console.log("Message failed to send to Bot owner"));
});

const urlRegex =
  /((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi;

const twitterUrls = ["http://twitter.com/", "https://twitter.com/"];

client.on("ready", () => {
  console.log("Started TwitFix");
  console.log("Username: " + client.user.username);
});

async function someAsync(array, f) {
  for (const element of array) {
    if (await f(element)) {
      return true;
    }
  }
  return false;
}

function getURL(string) {
  let urlMatches = string.match(urlRegex);
  if (urlMatches == null) {
    return;
  }
  return urlMatches[0];
}

client.on("message", async (message) => {
  if (message.author.id === client.user.id) {
    return;
  }
  let url = getURL(message.content);
  const hasValidTwitterLink = await someAsync(
    twitterUrls,
    async (twitterUrl) => url.includes(twitterUrl) && url.includes("status")
  );

  const isVideo = await checkIfVideo(url);

  if (hasValidTwitterLink && isVideo) {
    let fixedLink = url.replace(/twitter/gm, "fxtwitter");
    message.reply(fixedLink);
  }
});

const checkIfVideo = async (link) => {
  let url = new URL(link);
  let tweetID = url.pathname.split("/").pop();
  let apiLink = `https://api.twitter.com/2/tweets/${tweetID}?media.fields=type&expansions=attachments.media_keys`;
  const response = await fetch(apiLink, {
    headers: {
      Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
    },
  });
  if (!response.ok) return false;

  const data = await response.json();
  const mediaType = data.includes.media[0].type;

  console.log("Found Twitter url: " + apiLink);
  if (!mediaType) {
    console.log("Could not get type of media from the tweet");
    return false;
  }

  console.log("The media in this tweet is of type: " + mediaType.toUpperCase());

  if (mediaType == "video") {
    return true;
  }
  return false;
};

client.login(process.env.BOT_TOKEN);
