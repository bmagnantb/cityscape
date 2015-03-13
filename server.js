function startServer() {
    var express = require('express'),
        http = require('http'),
        path = require('path'),
        app = express();

    app.set('port', process.argv[3] || process.env.PORT || 3000);
    app.use(express.static(path.join(__dirname, '')));

    http.createServer(app).listen(app.get('port'), function() {
        console.log('Express server listening on port ' + app.get('port'));
    });
}

startServer();