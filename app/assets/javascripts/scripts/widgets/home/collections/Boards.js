/**
 * @author Timophey Molchanov <timopheym@gmail.com>
 * @class BoardsCollection
 * @extends Backbone.Collection
 * Date: 6/21/13 3:37 PM
 *
 */

"use strict";

var Backbone = require('Backbone.iobind'),
    BoardModel = require('BoardModel'),
    Fripple = require('Fripple');

var BoardsCollection = Backbone.Collection.extend({
    model: BoardModel,
//    socket: Backbone.socket,
    url: function () {
        return "/boards";
    },
    initialize: function () {
        this.on("collectionCleanup", this.collectionCleanup, this);
//        Fripple.socket.on("/board:create", this.serverCreate, this);
    }
});

module.exports = BoardsCollection;