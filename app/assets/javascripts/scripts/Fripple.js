/**
 * @author Timophey Molchanov <timopheym@gmail.com>
 * @class Teempla
 * @extends Backbone.Model
 * Date: 6/12/13 3:50 PM
 *
 */
"use strict";

var Backbone = require('Backbone');
    Backbone.Marionette = require('Backbone.Marionette');

var Fripple = new Backbone.Marionette.Application({

});
Fripple.addRegions({
    haeder: "#header",
    bar: "#bar",
    content: "#content"
});
module.exports = Fripple;