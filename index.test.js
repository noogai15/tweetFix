const cheerio = require("cheerio");
const { Client, Intents, MessageEmbed } = require("discord.js");
require("dotenv").config();
const fetch = require("node-fetch");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
const cmd = "!cs";
var schedules = [];
var lastStatus = {};

//Cheerio Scraper
//@params: void
//return: JSON Object (Movies)
async function scrapeAllMovies() {
  const res = await fetch(
    "https://www.uci-kinowelt.de/coming-soon#!#scroll-to-the-program-please"
  );

  const body = await res.text();
  const $ = cheerio.load(body);
  const movies = $(".slide-content"); //Returns Cheerio Object Collection with all the children
  const mappedMovies = [];

  //@params: i: int = index; movie: HTML Node
  movies.each((i, movie) => {
    mappedMovies[i] = {
      title: $(movie).children().first().first().text().trim(),
      releaseDate: $(movie).children().first().siblings("h4").text().trim(),
      available: !$(movie).children().toString().includes("inactive"),
    };
  });
  return mappedMovies;
}

//ON READY
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

//ON MESSAGE
client.on("messageCreate", (message) => {
  //PREVENTIVE CHECKS
  if (message.author.bot) return;
  if (!message.content.startsWith(`${cmd} `)) return;
  const sentence = message.content.substr(4).trim(); //Movie Search keyword
  if (sentence === "") return;

  //CLEAR SCHEDULES COMMAND
  if (sentence === "csclear") {
    console.log("Clearing all schedules");
    schedules.forEach((s) => {
      clearInterval(s);
    });
    message.channel.send("Stopped");
    return;
  }

  //LIST ALL MOVIES COMMAND
  if (sentence === "csall") {
    console.log("Getting all movies");
    scrapeAllMovies().then((allMovies) => {
      allMovies.forEach((movie) => {
        message.channel.send("`" + movie.title + "`");
      });
    });
  }

  //HELP COMMAND
  if (sentence === "help") {
    console.log("Getting all commands");
    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setTitle("Commands")
          .addField(
            "Get scheduled updates on movie availability",
            "!cs <movie name> (<movie2 name>...)\ne.g. !cs Fight Club Black Panther..."
          )
          .addField("Clear all scheduled tasks", "!cs csclear")
          .addField("Get all movies", "!cs csall"),
      ],
    });
  }

  console.log(`Sentence is: ${sentence.toUpperCase()}`);
  const timer = 1000 * 3600; //in ms (factor 2: 3600 for 1h)

  scrapeAllMovies().then((allMovies) => {
    allMovies.forEach((movie) => {
      const title = movie.title;

      if (sentence.toUpperCase().includes(title.toUpperCase())) {
        console.log(`Found movie: ${title}`);
        const embed = new MessageEmbed()
          .setTitle(title)
          .setDescription(movie.releaseDate);

        if (movie.available && lastStatus[title] === false) {
          lastStatus[title] = movie.available;
          embed.addField("Tickets Status: ", "`AVAILABLE`", true);
          message.reply({ embeds: [embed] });
        } else if (movie.available) {
          lastStatus[title] = movie.available;
          embed.addField("Tickets Status: ", "`AVAILABLE`", true);
          message.channel.send({ embeds: [embed] });
        } else {
          lastStatus[title] = movie.available;
          embed.addField("Tickets Status: ", "Not available...", true);
          message.channel.send({ embeds: [embed] });
        }

        console.log("SENDING");
        schedules = [];
        var s = setInterval(() => {
          console.log("SENDING");
          message.channel.send({ embeds: [embed] });
        }, timer);
        schedules.push(s);
      }
    });
  });
});

//ON UNCAUGHT ERROR
process.on("uncaughtException", (err) => {
  console.error(err);
  if (!process.env.BOT_OWNER_ID) {
    throw Error("missing bot owner id");
  }
  client.users.cache
    .get(process.env.BOT_OWNER_ID)
    .send("I fucking died.\nError: " + err)
    .then(() => process.exit(1))
    .catch(() => console.log("Message failed to send to Bot owner"));
});

client.login(process.env.TOKEN);
