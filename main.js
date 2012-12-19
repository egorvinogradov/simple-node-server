/**
 * Main server
 */

var http = require('http');
var url = require('url');
var fs = require('fs');
var utils = require('./utils');
var router = require('./router');
var staticFiles = require('./static');
var $ = utils;


var routerConfig = {
    api: {
        json: {
            demo: {
                pathnameRegExp: /\/demo.*/,
                callback: function(options){
                    console.log('json api:', options.request.url);
                    options.success({
                        status: 'OK',
                        data: 'JSON was transfered successfully'
                    });
                }
            }
        },
        websockets: {
            demo: {
                pathnameRegExp: /\/demo.*/,
                callback: function(options){
                    console.log('websocket api:', options.request.url);
                    options.success({
                        status: 'OK',
                        data: '111'
                    });
                }
            }
        }
    },
    staticFiles: {
        callback: staticFiles.serve
    }
};


/* Server */

var Server = function(){
    /** @constructor */
};

Server.prototype = {
    initialize: function(router, routerConfig, port){
        this.router = router;
        this.routerConfig = routerConfig;
        this.port = port;
        this.server = http.createServer($.proxy(this.onRequest, this));
        this.getServerConfig($.proxy(function(serverConfig){
            this.serverConfig = serverConfig;
            this.router.initialize(this.routerConfig, this.serverConfig);
            this.server.listen(port);
            console.log('Server initialized', this.serverConfig);
        }, this));
    },
    getServerConfig: function(callback){
        fs.readFile('settings/config.json', function(error, data){
            if ( error ) {
                throw error;
            }
            callback(JSON.parse(data));
        });
    },
    onRequest: function(request, response){
        console.log(request.url);
        router.route({
            request: request,
            response: response,
            success: $.proxy(function(data){
                console.log('On success');
                this.onSuccess(response, data);
            }, this),
            error: $.proxy(function(e){
                this.onError(response, e);
            }, this)
        });
    },
    onSuccess: function(response, data){
        response.writeHead(200, {
            'Content-Type': 'application/json'
        });
        response.write(
            JSON.stringify(data)
        );
        response.end();
    },
    onError: function(response, e){
        response.writeHead(404, {
            'Content-Type': 'application/json'
        });
        response.write(JSON.stringify({
            status: 404
        }));
        response.end();
    }
};

var server = new Server();
var port = process.env.PORT || 3000;
server.initialize(router, routerConfig, port);
console.log('Server started on ' + port);
