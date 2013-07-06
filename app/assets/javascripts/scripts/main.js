/**
 * @author Timophey Molchanov <timopheym@gmail.com>
 * @class Main
 * @description Main Teempla file. Execution starts from here.
 * All setup settings have to be placed here
 * Date: 6/12/13 8:25 PM
 */

"use strict";

var $ = require('$'),
    _ = require('_'),
    Backbone = require('backbone'),
    Fripple = require('Fripple'),
    io = require('socket.ioHelper'),
    widgetsManager = require('widgetsManager');

$(function () {
    var url;
//    (function () {
//        var delegateEvents = Backbone.View.prototype.delegateEvents;
//
//        Backbone.SocketIoEvents = {
//            delegateSocketIoEvents: function () {
//                var callback, method, shortcut, _ref, event;
//                if (!this.ioEvents) return;
//                _ref = this.ioEvents;
//                for (event in _ref) {
//                    callback = _ref[event];
//                    if (!_.isFunction(callback)) method = this[callback];
//                    if (!method) throw new Error("Method " + callback + " does not exist");
//
//                    method = _.bind(method, this);
//                    Fripple.socket.on(event, method); // передаем в socket.io
//                }
//            }
//        };
//
//        /**
//         * @lends Backbone.View.prototype
//         */
//        _.extend(Backbone.View.prototype, {
//            delegateEvents: function () {
//                delegateEvents.apply(this, arguments);
//                Backbone.SocketIoEvents.delegateSocketIoEvents(this.ioEvents, this);
//            }
//        });
//    })();
    //Init socket connection
    //TODO: FIRST TIME ONLY! Connection with server will be manage throw models and collections!
//    url = (window.location.protocol + '//' + window.location.host) + '3';
//    Backbone.socket = Fripple.socket = io.connect(url);
//    Fripple.socket.emit('connect-test');
//    Fripple.socket.emit('connect', ['board'], function (err, data) {
//        if (err) {
//            throw new Error('Unable to connect.');
//        } else {
//    console.log('Connected!');
    //Get servers settings
//    Fripple.userSettings = window.userSettings;

    // Initialize Widgets Manager
    new widgetsManager();
    Fripple.trigger('startWidget', { name: 'app', options : {} });
//        }
//    });
});
