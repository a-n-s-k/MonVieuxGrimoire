const rateLimit = require("express-rate-limit");

module.exports = () => { 
rateLimit({
	windowMs: 60 * 1000,
	max: 10,
	message: "Vous avez éffectué trop de requettes en peu de temps, vous pouvez réessayer plus tard.",
	standardHeaders: true,
});
}
