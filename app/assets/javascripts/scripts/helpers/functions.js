/**
 * @author Timophey Molchanov <timopheym@gmail.com>
 * @class functionsHelper
 * Date: 6/15/13 1:44 PM
 */
"use strict";

var functionsHelper = {
    guid : function () {
        function S4() {
            return (((1 + Math.random()) * 0x10000)|0).toString(16).substring(1);
        }

        return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
//        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    }
};


module.exports = functionsHelper;