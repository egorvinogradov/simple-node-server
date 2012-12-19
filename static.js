/**
 * Static server
 * @example:
 * var staticServer = require('./static');
 * staticServer.serve(<options>);
 */

var nodeStatic = require('node-static');
var serveStatic = function(options){

    console.log('Static file:', options.request.url);
    
    var staticServer = new nodeStatic.Server(options.config.staticServer.root, {
        cache: options.config.staticServer.cache
    });

    staticServer.serve(options.request, options.response, $.proxy(function(error, result){
        
        if ( error ) {

            var defaultFileExtension = options.config.staticServer.defaultFileExtension;
            var defaultFileExtensionRegExp = new RegExp('/\\' + defaultFileExtension + '$', 'i');
            
            if ( !defaultFileExtensionRegExp.test(options.request.url) ) {

                options.request.url = options.request.url.replace(/\/$/, '') + defaultFileExtension;
                staticServer.serve(options.request, options.response, function(error, result){
                
                    if ( error ) {

                        console.log('Error:', options.request.url, error);
                        var errorPageUrl = error.status in options.config.errorPages
                            ? options.config.errorPages[error.status]
                            : options.config.errorPages.default;

                        staticServer.serveFile(
                            errorPageUrl,
                            error.status,
                            {},
                            options.request,
                            options.response
                        );
                    }
                });
            }
        }
    }, this));
};

exports.serve = serveStatic;
