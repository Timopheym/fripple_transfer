/**
 * Created with JetBrains RubyMine.
 * User: T
 * Date: 7/24/13
 * Time: 11:08 PM
 * To change this template use File | Settings | File Templates.
 */
/**
 * @author Timophey Molchanov <timopheym@gmail.com>
 * @class WidgetsManager
 * @extends Object
 * Date: 6/12/13 10:27 PM
 *
 */

"use strict";

var Fripple = require('Fripple'),
    $ = require('$'),
    _ = require('_');

var storageManager = function () {
    var self = this,
        evnt = new EventSource('/events');
    this.collections = {};
    Fripple.on('add:storage',function (e) {
        self.collections[e.name] = e.value;
    });
    Fripple.on('get:storage',function (e) {
        e.callback(self.collections[e.name]);
    });
    Fripple.on('update:storage',function () {
        self.collections[e.name].get(e.id).set(e.property, e.value);
    });
    evnt.addEventListener('message', function(e) {
        var message = $.parseJSON(e.data);
        message.data = $.parseJSON(message.data);
        console.log(message.event)
        if (message.event == "boards:create") {
            console.log(self.collections.boards)
            if (typeof message.data.id == "object") {
                message.data.id = message.data.id.$oid
            }
//            else {
//                message.data.id = message.data.id.$oid
//            }

            self.collections.boards.add(message.data);
        } else if (message.event == "boards:read") {

        } else if (message.event == "boards:update") {
            self.collections.boards.get(message._id.$oid)
                .set(message.data.property, message.data.value);
        } else if (message.event == "boards:delete") {

        } else if (message.event == "boards:open") {
            Fripple.trigger('boards:create', message.data._id.$oid)
        } else if (message.event == "boards:open") {

        }
    });
};

module.exports = storageManager;