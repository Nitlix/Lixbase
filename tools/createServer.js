const express = require('express');
const version = require('../constants/version');

module.exports = function(port){
    const app = express();
    app.disable('x-powered-by');
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header("X-Powered-By", `Lixbase Server ${version}`);
        next();
    });
    
    return app;
}