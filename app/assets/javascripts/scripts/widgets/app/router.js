/**
 * @author Timophey Molchanov <timopheym@gmail.com>
 * @class appRouter
 * @extends Backbone.Router
 * @description General Fripple router
 * Date: 6/12/13 9:18 PM
 *
 */
"use strict";

var backbone = require('backbone'),
    Fripple = require('Fripple');

var appRouter = backbone.Router.extend({
    //TODO: Before navigate test - if user auth?
    routes: {
        ''                  : 'home',
        'library'           : 'library',
        'library/:cat'      : 'library',
        'boards'            : 'board',
        'boards/:bid'       : 'board',
        'constructor/:eid'  : 'constr',
        'constructor'       : 'constr'
    },
    home: function () {
        Fripple.trigger('startWidget', { name : 'home', options : {}});
        console.debug('[Router] Home page');
    },
    board: function (bid) {
        Fripple.trigger('startWidget', { name : 'board', options : { bid : bid}});
        console.debug('[Router] Board page');
    },
    library: function (cat) {
        Fripple.trigger('startWidget', { name : 'library', options : { cat : cat}});
        console.debug('[Router] Library page');
    },
    constr: function (eid) {
        Fripple.trigger('startWidget', { name : 'constructor', options : { eid: eid }});
        console.debug('[Router] Constructor page');
    }
});

module.exports = appRouter;