import { Client, GatewayIntentBits, SlashCommandBuilder } from "discord.js";

import { hasValidTwitterLink } from "./link";

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

  const fxCommand = new SlashCommandBuilder()
    .setName("fxt")
    .setDescription("Replaces a Twitter/X link with an fxtwitter version")
    .addStringOption((option) =>
      option.setName("input").setDescription("The Twitter/X link to be fixed").setRequired(true)
    );
  client.application?.commands.create(fxCommand);
});

client.on("interactionCreate", (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName == "fxt") {
    let input = interaction.options.data[0].value;

    if (!input) return;
    let fixedLink = main(input.toString())!;

    if (!fixedLink)
      interaction.reply({ content: "Please provide a proper Twitter/X link", ephemeral: true });
    else interaction.reply(fixedLink);
  }
});

function getURL(string: string) {
  let urlMatches = string.match(urlRegex);
  console.log("String = " + string);
  console.log("Matches = " + urlMatches);

  if (urlMatches == null) return;
  return urlMatches[0];
}

function main(messageString: string) {
  let url = getURL(messageString);
  if (!url) return;
  if (!hasValidTwitterLink(url)) return;

  let fixedLink = url.replace(/(twitter|x\.com)/gm, (match: string) =>
    match === "twitter" ? "fxtwitter" : "fxtwitter.com"
  );
  return fixedLink;
}

// client.on("messageCreate", async (message: Message) => {
//   console.log(`Got message: ${message}`);
//   let fixedLink = main(message);

//   if (fixedLink) message.reply(fixedLink);
//   console.log("Test");
//   message.suppressEmbeds(true); //not really needed right now since Discord shows no Twitter embeds at all anymore
// });

client.login(process.env.BOT_TOKEN);
