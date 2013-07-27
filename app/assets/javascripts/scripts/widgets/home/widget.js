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
    homeWrapperTpl = require('homeWrapperTpl');

var homeWidget = backbone.View.extend({

    events : {
      'click .create-board' : 'onCreateBoardClick',
      'click .board-item' : 'onBoardItemClick'
    },
    onBoardItemClick : function (e){
        var item = e.currentTarget,
            id = $(item).data('id');
        this.openBoard(id);
    },
    onCreateBoardClick : function (e){
        var name = prompt("Enter board name:"),
            board = new BoardModel({
            name : name
        });
        this.collection.add(board.save());
    },
    openBoard: function (id){
        Fripple.trigger('route', '/boards/' + id )
    },
    initialize : function () {
        var self = this;
        this.$parent = $('#Fripple-app-content');
        this.setElement('#Fripple-news');
        this.template = _.template(homeWrapperTpl, {});
        console.log(this.template,'template');
        this.collection = new BoardsCollection();
        this.collection.on('add', function (model){
            console.log('add---')
            console.log(model);
            self.$el.append('<p class="board-item" data-id="'+model.get('id')+'">'
                +model.get('name')+
            '</p>');
        });
        Fripple.trigger('add:storage', {name : 'boards', value: this.collection});
        this.start();
    },

    /**
     * Start widget
     * Render widget to DOM
     * */
    start : function () {
        var self = this;
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

module.exports = homeWidget;