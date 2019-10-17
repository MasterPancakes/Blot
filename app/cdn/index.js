var Express = require("express");
var cdn = Express.Router();
var config = require("config");

// This route is used by Blot's CDN (AWS Cloudfront) to retrieve
// static assets generated by Blot and serve them to your readers.
// A request to:
//
// https://blotcdn.com/{blogID}/path-to/file.jpg
//
// Will have its SSl terminated by Cloudfront close to the user.
// Cloudfront will then request the following URL from Blot's
// main server and send back the response:
//
// https://blot.im/static/{blogID}/path-to/file.jpg
//
// Cloudfront will store this response to server future requests

cdn

  // These files are generated by Blot and their paths contain GUIDs.
  // They never change and can be cached forever.
  .use(
    "/cdn",
    Express.static(config.blog_static_files_dir, {
      immutable: true,
      maxAge: "31536000",
      lastModified: false,
      etag: false
    })
  );

// It might be nice to add a route which can render CSS and JS
// on a particular template
module.exports = cdn;
