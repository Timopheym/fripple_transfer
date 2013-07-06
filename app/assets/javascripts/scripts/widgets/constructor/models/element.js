/**
 * @author Timophey Molchanov <timopheym@gmail.com>
 * @class elementModel
 * @extends Backbone.Model
 * Date: 6/2/13 6:59 PM
 *
 */

"use strict";

var $ = require('$'),
    _ = require('_'),
    i18n = require('i18n'),
    Fripple = require('Fripple'),
    backbone = require('backbone');

var elementModel = backbone.Model.extend({
    defaults : {
        objects: []
    },
    initialize : function () {
        console.debug('[Initialize] Element Builder model');
    },
    export : function () {
        var objects = [];
        _.forOwn(this.get('objects'), function (obj) {
            objects.push(obj.get('paperObject').toJSON());
        });
        return objects;
    }
});


module.exports = new elementModel();