/*
 * Router
 * @example:
 * var router = require('./router');
 * router.initialize(routerConfig, serverConfig);
 * router.route(<options>);
 */

var url = require('url');
var $ = require('./utils');

var router = {
    initialize: function(routerConfig, serverConfig){
        if ( !routerConfig || !serverConfig ) {
            throw new Error('Router: no required data provided');
        }
        this.routerConfigConfig = routerConfig;
        this.serverConfig = serverConfig;
    },
    route: function(options){
        var requestPathname = url.parse(options.request.url).pathname;
        for ( var apiName in this.serverConfig.api ) {
            
            var apiConfig = this.serverConfig.api[apiName];
            var apiPrefixRe = new RegExp('^\\' + apiConfig.urlPrefix + '\\/', 'i');

            if ( apiPrefixRe.test(requestPathname) ) {

                var apiPath = requestPathname.substr(this.serverConfig.api.urlPrefix.length);

                console.log('zzzzzzzzz\n\n', this.routerConfig.api, routeName);

                for ( var routeName in this.routerConfig.api ) {
                    if ( this.routerConfig.api[routeName].pathnameRegExp.test(apiPath) ) {
                        this.routerConfig.api[routeName].callback(options);
                        return;
                    }
                }
            }
        }
        this.routerConfig.staticFiles.callback(
            $.extend(options, {
                config: this.serverConfig
            }
        ));
    }
};

for ( var method in router ) {
    exports[method] = router[method];
}
