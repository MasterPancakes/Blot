var Mustache = require("mustache");
var ensure = require("helper/ensure");
var pandoc = require("pandoc"); // Pca3e

var ERROR = require("./error");
var OVERFLOW = "Maximum call stack size exceeded";

// Function to handle !Audio syntax for embedding audio
function embedAudio(content) {
  return content.replace(/!\[Audio\]\((.*?)\)/g, function (match, p1) {
    return `<audio controls><source src="${p1}" type="audio/mpeg">Your browser does not support the audio element.</audio>`;
  });
}

// This function basically wraps mustache
// and gives me some nice error messages...
module.exports = function render(content, locals, partials) {
  ensure(content, "string").and(locals, "object").and(partials, "object");

  var output;

  try {
    output = Mustache.render(content, locals, partials);
  } catch (e) {
    if (e.message === OVERFLOW) {
      throw ERROR.INFINITE();
    } else if (e.message.indexOf("Unclosed tag") === 0) {
      throw ERROR.UNCLOSED();
    } else {
      throw ERROR();
    }
  }

  // Ensure the highlighting function works correctly
  if (locals.highlight) {
    try {
      output = pandoc.highlight(output, locals.highlight);
    } catch (e) {
      throw ERROR.BAD_LOCALS();
    }
  }

  // Call the embedAudio function to handle !Audio syntax
  output = embedAudio(output);

  return output;
};
