/**
 * @author Timophey Molchanov <timopheym@gmail.com>
 * @class appWidget
 * @extends Backbone.View
 * Date: 6/12/13 4:03 PM
 *
 */

"use strict";


var backbone = require('backbone'),
    $ = require('$'),
    _ = require('_'),
    appWrapperTpl = require('appWrapperTpl'),
    appRouter = require('appRouter');

var appWidget = backbone.View.extend({

    initialize : function () {
        this.setElement('#Fripple-app');
        this.$parent = $('body');
        this.template = _.template(appWrapperTpl, {isAdmin : false});
        this.start();
    },

    /**
     * Start widget
     * Render widget to DOM
     * */
    start : function () {
        if (this.$el.length === 0) { //Append element to parent
            this.$parent.append($('<div/>').attr('id', 'Fripple-app'));
            this.setElement('#Fripple-app');
        }

        this.render();

        // Initialize the application general router
        new appRouter();

        // Start html5 browser history
        backbone.history.start();
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
        this.$el.append(this.template);
    }

});

module.exports = appWidget;