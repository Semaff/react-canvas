const Router = require("express");
const router = new Router();
const imageRouter = require('./imageRouter');

router.use('/image', imageRouter);

module.exports = router;