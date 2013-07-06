/**
 * @author Timophey Molchanov <timopheym@gmail.com>
 * @class BoardModel
 * @extends Backbone.RelationalModel
 * Date: 6/19/13 1:01 AM
 *
 */


"use strict";

var Backbone = require('Backbone.iobind'),
    ItemModel = require('ItemModel'),
    ItemsCollection = require('ItemsCollection');

Backbone.RelationModel = require('Backbone.Relational');

var BoardModel = Backbone.RelationalModel.extend({
    idAttribute: "_id",
    noIoBind: false,
    socket: Backbone.socket,
    relations: [
        {
            type: Backbone.HasMany,
            key: 'elements',
            relatedModel: 'ItemModel',
            collectionType: 'ItemsCollection',
            reverseRelation: {
                key: 'placedIn',
                includeInJSON: 'id'
            }
        }
    ],
    url: function () {
        return "/boards" + (this.id ? "/" + this.id : "");
    },
    defaults: function () {
        return {
            name: "empty board"
        };
    },
    initialize: function () {

    }
});


module.exports = BoardModel;