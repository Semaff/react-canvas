const ApiError = require('../error/ApiError');

const ErrorHandler = function (err, req, res, next) {
    if(err instanceof ApiError){
        console.log(err)
        return res.status(err.status).json({message: err.message});
    }
    return res.status(500).json({message: `${err}`});
}

module.exports = ErrorHandler;