/**
 * @author Timophey Molchanov <timopheym@gmail.com>
 * @class uploaderWidget
 * @extends Backbone.View
 * Date: 6/12/13 4:03 PM
 *
 */

"use strict";


var backbone = require('backbone'),
    $ = require('$'),
    _ = require('_'),
    i18n = require('i18n'),
    Fripple = require('Fripple'),
    constructorWrapperTpl = require('constructorWrapperTpl'),
    elementModel = require('elementModel'),
    skinView = require('skinView'),
    logicView = require('logicView');

var appWidget = backbone.View.extend({

    events: {
        'click #resetButton' : 'onResetClick',
        'click #runButton' : 'onRunClick',
        'click .save' : 'onSaveClick',
        'click .skin-add-button' : 'onAddSkinClick',
        'click .circle' : 'onCircleClick',
        'click .rectangle' : 'onRectangleClick'
    },
    onRectangleClick : function () {
        console.debug('[Clicked] Rectangle');
        this.skinView.addRectangle();
    },
    onCircleClick : function () {
        console.debug('[Clicked] Circle');
        this.skinView.addCircle();
    },
    onResetClick : function () {
        document.getElementById('runButton').style.display = 'inline';
        document.getElementById('resetButton').style.display = 'none';
        this.state = 0;
        this.logicView.reset();
    },
    onRunClick : function () {
        var runButton = document.getElementById('runButton'),
            resetButton = document.getElementById('resetButton');

        // Ensure that Reset button is at least as wide as Run button.
        if (!resetButton.style.minWidth) {
            resetButton.style.minWidth = runButton.offsetWidth;
        }
        runButton.style.display = 'none';
        resetButton.style.display = 'inline';
        this.logicView.execute();
    },
    onAddSkinClick : function () {
        console.debug('[Clicked] Add skin');
    },
    onSaveClick : function () {
        console.debug('[Clicked] Save element');
        var element = {
            objects : this.element.export(),
            code : this.logicView.getCode(),
            blocks : this.logicView.getXML()
        };
        console.debug(JSON.stringify(element));
    },
    initialize : function () {
        this.$parent = $('#Fripple-app-content');
        this.setElement('#Fripple-uploader');
        this.template = _.template(constructorWrapperTpl, {i18n : i18n});
        this.start();
//
//        /* Events router */
//        Fripple.on('elementBuilderModel:Skins:loaded',function(){
//            self.renderSkins();
//        });
//        Fripple.on('elementBuilderModel:Logic:loaded',function(){
//            self.renderLogic();
//        });
//
//        /* Initing elementBuilder model*/
//        this.model.loadSkins();
//        this.model.loadLogic();
    },

    /**
     * Start widget
     * Render widget to DOM
     * */
    start : function () {
        if ($('#Fripple-uploader').length === 0) { //Append element to parent
            this.$parent.html($('<div/>').attr('id', 'Fripple-uploader'));
            this.setElement('#Fripple-uploader');
        }
        this.render();
        this.element = elementModel;
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
        this.loadSkin();
        this.loadLogic();
    },
    loadSkin : function () {
        this.skinView = new skinView();
        this.skinView.addCircle();
    },
    loadLogic : function () {
        this.logicView = new logicView();
        Fripple.trigger('logicView:loaded');
    }


});

module.exports = appWidget;