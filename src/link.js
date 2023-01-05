"use strict";
exports.__esModule = true;
var twitterUrls = ["http://twitter.com/", "https://twitter.com/"];
function hasValidTwitterLink(url) {
    return twitterUrls.some(function (twitterUrl) { return url.includes(twitterUrl) && url.includes("status"); });
}
exports.hasValidTwitterLink = hasValidTwitterLink;
