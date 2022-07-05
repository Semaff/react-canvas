const ApiError = require("../error/ApiError");
const fs = require('fs');
const path = require('path');

class ImageController {
    async getImage(req, res, next) {
        try {
            const { id } = req.query;
            const file = fs.readFileSync(path.resolve(__dirname, "..", 'files', `${id}.jpg`));
            const data = `data:image/png;base64,` + file.toString('base64');

            return res.json(data);
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async postImage(req, res, next) {
        try {
            const { id } = req.query;
            const data = req.body.img.replace(`data:image/png;base64,`, '');
            fs.writeFileSync(path.resolve(__dirname, "..", 'files', `${id}.jpg`), data, 'base64');
            return res.status(200).json({ message: "Загружено" });
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }
}

module.exports = new ImageController();