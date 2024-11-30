var absoluteURLs = require("./absoluteURLs").absoluteURLs;
var cheerio = require("cheerio");

function removeXMLInvalidChars (string) {
  var regex =
    /((?:[\0-\x08\x0B\f\x0E-\x1F\uFFFD\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]))/g;
  return string.replace(regex, "");
}

module.exports = function (req, callback) {
  return callback(null, function () {
    return function (text, render) {
      var xml;
      var $;

      text = render(text);

      try {
        $ = cheerio.load(
          text,
          {
            decodeEntities: false
          },
          false
        );
        $ = absoluteURLs(req.protocol + "://" + req.get("host"), $);
        $("script").remove();
        xml = $.html();
        xml = removeXMLInvalidChars(xml);
      } catch (e) {
        console.log(e);
      }

      return xml || text;
    };
  });
};

function handleDateSelection(req, callback) {
  var fromDate, toDate;

  try {
    fromDate = req.query.from ? new Date(req.query.from) : null;
    toDate = req.query.to ? new Date(req.query.to) : null;
  } catch (e) {
    fromDate = null;
    toDate = null;
  }

  var xml;
  var $;

  try {
    $ = cheerio.load(
      req.body.text,
      {
        decodeEntities: false
      },
      false
    );
    $ = absoluteURLs(req.protocol + "://" + req.get("host"), $);
    $("script").remove();
    xml = $.html();
    xml = removeXMLInvalidChars(xml);
  } catch (e) {
    console.log(e);
  }

  callback(null, xml || req.body.text);
}
