import { Client, GatewayIntentBits, Message } from "discord.js";

import { hasValidTwitterLink } from "./link";
import { checkIfVideo } from "./twitter";

import "dotenv/config";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client;
process.on("uncaughtException", (err) => {
  console.error(err);
  if (!process.env.BOT_OWNER_ID) {
    throw Error("missing bot owner id");
  }
  client.users.cache
    .get(process.env.BOT_OWNER_ID)
    ?.send("I crashed.\nError: " + err)
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
    ?.send("I crashed.\nError: " + err)
    .then((message: any) => process.exit(1))
    .catch(() => console.log("Message failed to send to Bot owner"));
});

const urlRegex =
  /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/gi;

client.on("ready", () => {
  console.log("Node: " + process.version);
  console.log("Started TwitFix");
  console.log("Username: " + client.user!.username);
});

function getURL(string: string) {
  let urlMatches = string.match(urlRegex);
  console.log("String = " + string);
  console.log("Matches = " + urlMatches);
  if (urlMatches == null) {
    return;
  }
  return urlMatches[0];
}

client.on("messageCreate", async (message: Message) => {
  console.log(`Got message: ${message}`);
  if (message.author.bot) {
    message.content.toUpperCase();
    return;
  }

  let url = getURL(message.content);
  if (!url) {
    console.log("No URL found");
    return;
  }
  console.log("Got URL");

  if (hasValidTwitterLink(url)) {
    console.log("Found valid Twitter link");
  } else {
    console.log("No valid Twitter link");
    return;
  }
  const isTwitterVideo = await checkIfVideo(url);
  let fixedLink = "";

  if (!isTwitterVideo) return;
  if (url.includes("twitter")) fixedLink = url.replace(/twitter/gm, "fxtwitter");
  else if (url.includes("x.com")) fixedLink = url.replace(/x.com/gm, "fxtwitter.com");

  message.reply(fixedLink);
  console.log("Test");
  message.suppressEmbeds(true);
});

client.login(process.env.BOT_TOKEN);
