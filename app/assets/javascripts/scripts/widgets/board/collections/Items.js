/**
 * @author Timophey Molchanov <timopheym@gmail.com>
 * @class ItemsCollection
 * @extends Backbone.Collection
 * Date: 6/21/13 3:37 PM
 *
 */

"use strict";

var Backbone = require('Backbone.iobind'),
    ItemModel = require('ItemModel');
var ItemsCollection = Backbone.Collection.extend({
    url: '/items/',
    model: ItemModel,
    socket: Backbone.socket,
    initialize: function () {
    }
});

module.exports = ItemsCollection;