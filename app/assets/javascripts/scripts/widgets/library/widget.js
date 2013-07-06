/**
 * @author Timophey Molchanov <timopheym@gmail.com>
 * @class newsWidget
 * @extends Backbone.View
 * Date: 6/12/13 4:03 PM
 *
 */

"use strict";


var backbone = require('backbone'),
    $ = require('$'),
    _ = require('_'),
    BoardsView = require('BoardsView'),
    BoardsCollection = require('BoardsCollection'),
    BoardModel = require('BoardModel'),
    Fripple = require('Fripple'),
    libraryWrapperTpl = require('libraryWrapperTpl');

var libraryWidget = backbone.View.extend({


    initialize : function () {
        this.$parent = $('#Fripple-app-content');
        this.setElement('#Fripple-news');
        this.template = _.template(libraryWrapperTpl, {});
        this.collection = new BoardsCollection();
        this.start();
//        console.log(Fripple);
    },

    /**
     * Start widget
     * Render widget to DOM
     * */
    start : function () {
        if ($('#Fripple-news').length === 0) { //Append element to parent
            this.$parent.html($('<div/>').attr('id', 'Fripple-news'));
            this.setElement('#Fripple-news');
        }
        this.render();
        new BoardsView();
        console.log('Fetching collection');
        this.collection.fetch();
    },

    /**
    * Stop widget
    * Keep all date in memory, but remove it from DOM
    * */
    stop : function () {
        this.$el.remove();
    },

    render : function () {
        this.$el.empty();
        this.$el.html(this.template);
    }

});

module.exports = libraryWidget;