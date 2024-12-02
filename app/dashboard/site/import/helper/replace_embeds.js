var cheerio = require("cheerio");
var parse = require("url").parse;

function replaceEmbeds(html, callback) {
  var $ = cheerio.load(html, { decodeEntities: false });

  $("iframe").each(function () {
    var src = $(this).attr("src");
    var vid = "";

    if (src.indexOf("youtube.com") > -1) {
      vid = parse(src).pathname;
      vid = vid.slice(vid.lastIndexOf("/") + 1);

      $(this).replaceWith("<p>https://www.youtube.com/watch?v=" + vid + "</p>");
    } else if (src.indexOf("vimeo.com") > -1) {
      vid = parse(src).pathname;
      vid = vid.slice(vid.lastIndexOf("/") + 1);

      $(this).replaceWith("<p>https://www.vimeo.com/" + vid + "</p>");
    }
  });

  $("audio").each(function () {
    var src = $(this).attr("src");
    var audio = "";

    if (src) {
      audio = parse(src).pathname;
      audio = audio.slice(audio.lastIndexOf("/") + 1);

      $(this).replaceWith("<p>![Audio](" + audio + ")</p>");
    }
  });

  return callback($.html());
}

module.exports = replaceEmbeds;
