/*
 * Utils
 */

var utils = {
    proxy: function(func, context){
        return function(){
            func.apply(context || {}, arguments);
        };
    },
    extend: function(){
        if ( arguments.length < 2 ) {
            return arguments[0];
        }
        var result = arguments[0] || {};
        for ( var i = 0, l = arguments.length; i < l; i++ ) {
            var obj = arguments[i];
            for ( var prop in obj ) {
                result[prop] = obj[prop];
            }
        }
        return result;
    }
};

console._log = console.log;
global.console.log = function(){
    Array.prototype.unshift.call(arguments, new Date() + ':\n');
    Array.prototype.push.call(arguments, '\n');
    console._log.apply({}, arguments);
};

for ( var method in utils ) {
    exports[method] = utils[method];
}
