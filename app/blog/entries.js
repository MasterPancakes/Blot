module.exports = function (server) {
  var Entries = require("models/entries");

  server.get("/page/:page_number", renderPage);
  server.get("/", renderPage);

  function renderPage(req, res, next) {
    var blog = req.blog;

    var pageNo, pageSize, fromDate, toDate;

    try {
      pageNo = parseInt(req.params.page_number) || 1;
    } catch (e) {
      pageNo = 1;
    }

    try {
      pageSize = req.template.locals.page_size || req.blog.pageSize;
      pageSize = parseInt(pageSize) || 5;
    } catch (e) {
      pageSize = 5;
    }

    try {
      fromDate = req.query.from ? new Date(req.query.from) : null;
      toDate = req.query.to ? new Date(req.query.to) : null;
    } catch (e) {
      fromDate = null;
      toDate = null;
    }

    Entries.getPage(blog.id, pageNo, pageSize, fromDate, toDate, function (entries, pagination) {
      var pageTitle = blog.title;

      if (pageNo > 1) {
        pageTitle = "Page " + pageNo + " of " + pageTitle;
      }

      pagination.current = pageNo;

      res.addLocals({
        pageTitle: pageTitle,
        entries: entries,
        pagination: pagination,
      });

      res.renderView("entries.html", next);
    });
  }
};
