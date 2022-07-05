const Router = require('express');
const imageController = require('../controllers/imageController');
const router = new Router();

router.get("/", imageController.getImage); // get an image
router.post("/", imageController.postImage); // post an image

module.exports = router;