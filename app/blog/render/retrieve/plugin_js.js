var Plugins = require("build/plugins");

module.exports = function (req, callback) {
  Plugins.load("js", req.blog.plugins, callback);
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

  Plugins.load("js", req.blog.plugins, function (err, plugins) {
    if (err) return callback(err);

    const filteredPlugins = plugins.filter(plugin => {
      const pluginDate = new Date(plugin.date);
      if (fromDate && pluginDate < fromDate) return false;
      if (toDate && pluginDate > toDate) return false;
      return true;
    });

    callback(null, filteredPlugins);
  });
}
