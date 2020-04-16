const FONTS = require("../../../../blog/static/fonts");
const Mustache = require("mustache");
const config = require("config");

module.exports = function(req, res, next) {
	console.log(req.locals);

	for (let key in req.locals) {
		if (key.indexOf("_font") === -1) continue;
		let match = FONTS.slice().filter(({ id }) => req.locals[key].id === id)[0];

		match.styles = Mustache.render(match.styles, {
			config: {
				cdn: { origin: config.cdn.origin },
			},
		});

		if (match)
			for (let prop in match)
				req.locals[key][prop] = req.locals[key][prop] || match[prop];
	}

	console.log(req.locals);

	next();
};
