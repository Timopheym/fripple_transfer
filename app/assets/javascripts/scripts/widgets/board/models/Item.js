/**
 * @author Timophey Molchanov <timopheym@gmail.com>
 * @class ItemModel
 * @extends Backbone.RelationalModel
 * Date: 6/19/13 1:01 AM
 *
 */


"use strict";

var Backbone = require('Backbone.iobind');

Backbone.RelationModel = require('Backbone.Relational');

var ItemModel = Backbone.RelationalModel.extend({
    socket: Backbone.socket,
    urlRoot: '/items/',
    relations: [],
    initialize: function () {}
});


module.exports = ItemModel;