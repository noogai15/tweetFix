"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
require("dotenv/config");
var link_1 = require("./link");
var twitter_1 = require("./twitter");
var _a = require("discord.js"), Client = _a.Client, Intents = _a.Intents;
var client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});
process.on("uncaughtException", function (err) {
    var _a;
    console.error(err);
    if (!process.env.BOT_OWNER_ID) {
        throw Error("missing bot owner id");
    }
    (_a = client.users.cache
        .get(process.env.BOT_OWNER_ID)) === null || _a === void 0 ? void 0 : _a.send("I fucking died.\nError: " + err).then(function () { return process.exit(1); })["catch"](function () { return console.log("Message failed to send to Bot owner"); });
});
process.on("unhandledRejection", function (err) {
    var _a;
    console.error(err);
    if (!process.env.BOT_OWNER_ID) {
        throw Error("missing bot owner id");
    }
    (_a = client.users.cache
        .get(process.env.BOT_OWNER_ID)) === null || _a === void 0 ? void 0 : _a.send("I fucking died.\nError: " + err).then(function (message) { return process.exit(1); })["catch"](function () { return console.log("Message failed to send to Bot owner"); });
});
var urlRegex = /((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi;
client.on("ready", function () {
    console.log("Node: " + process.version);
    console.log("Started TwitFix");
    console.log("Username: " + client.user.username);
});
function getURL(string) {
    var urlMatches = string.match(urlRegex);
    if (urlMatches == null) {
        return;
    }
    return urlMatches[0];
}
client.on("messageCreate", function (message) { return __awaiter(void 0, void 0, void 0, function () {
    var url, isTwitterVideo, fixedLink;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Got message");
                if (message.author.bot) {
                    message.content.toUpperCase();
                    return [2 /*return*/];
                }
                url = getURL(message.content);
                if (!url) {
                    return [2 /*return*/];
                }
                if (link_1.hasValidTwitterLink(url)) {
                    console.log("Found valid Twitter link");
                }
                else {
                    console.log("No valid Twitter link");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, twitter_1.checkIfVideo(url)];
            case 1:
                isTwitterVideo = _a.sent();
                if (isTwitterVideo) {
                    fixedLink = url.replace(/twitter/gm, "vxtwitter");
                    message.reply(fixedLink);
                    console.log("Test");
                    //message.delete()
                    client;
                    //permissions.has(Permissions.FLAGS.MANAGE_MESSAGES);
                    message.suppressEmbeds(true);
                }
                return [2 /*return*/];
        }
    });
}); });
client.login(process.env.BOT_TOKEN);
