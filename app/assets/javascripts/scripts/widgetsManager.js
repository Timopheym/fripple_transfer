/**
 * @author Timophey Molchanov <timopheym@gmail.com>
 * @class WidgetsManager
 * @extends Object
 * Date: 6/12/13 10:27 PM
 *
 */

"use strict";

var Fripple = require('Fripple'),
    _ = require('_'),
    appWidget = require('appWidget'),
    boardWidget = require('boardWidget'),
    libraryWidget = require('libraryWidget'),
    constructorWidget = require('constructorWidget'),
    homeWidget = require('homeWidget'),
    enterWidget = require('enterWidget');

var widgetsManager = function () {
    var self = this;
    /** Widget statuses:
    * 0 - not initialized
    * 1 - initialized
    * 2 - started
    * 3 - stopped
    * 4 - removed
    ** Widget types
    * 0 - Application
    * 1 - General section
    * 2 - Section menu
    * 3 - Section content
    * 4 - Modal Window
    * */
    this.widgets = {
        app : { status : 0, view : appWidget, type : 0},
        enter : { status : 0, view : enterWidget, type : 1 },
        home : { status : 0, view : homeWidget, type : 1 },
        board : { status : 0, view : boardWidget, type : 1 },
        library : { status : 0, view : libraryWidget, type : 1 },
        constructor : { status : 0, view : constructorWidget, type : 1 }
    };
    Fripple.on('startWidget', function (event) {
        self.startWidget(event);
    });
    Fripple.on('getWidget', function (event) {
        console.debug('Getting widget', name);
        if (self.widgets[event.name] && self.widgets[event.name].status === 2) {
            event.callback(self.widgets[event.name].view);
        } else {
            throw (new Error("Widget " + event.name + " not found or not started"));
        }
    });
};

widgetsManager.prototype.stopWidget = function (event) {
    console.debug('[Widgets Manager] Stopping widget', event.name);

    if (this.widgets[event.name].status !== 2) {
        console.error('Widget: ', this.widgets[event.name], ' event: ', event);
        throw (new Error('[Widgets Manager] in stopWidget, wrong widget status'));
    }

    this.widgets[event.name].view.stop(event.options);
    this.widgets[event.name].status = 3;

    console.debug('[Widgets Manager] Stopped widget', event.name, ' its status: ', this.widgets[event.name].status);

};

widgetsManager.prototype.startWidget = function (event) {
    console.debug('[Widgets Manager] Starting widget', event.name, ' now its status: ', this.widgets[event.name].status);
    var self = this,
        status = this.widgets[event.name].status;

    //If there already started widget in the same area - stop it
    //TODO (timopheym): Придумать как сделать это для всех типов виджетов
    _.forIn(this.widgets, function (settings, name) {
        if (
            (settings.type === self.widgets[event.name].type) &&
            (settings.status === 2)
        ) {
            self.stopWidget({name : name});
        }
    });

    if ((status === 0) || (status === 4)) { //Initialize widget
        this.widgets[event.name].view = new this.widgets[event.name].view(event.options);
        this.widgets[event.name].status = 2;
    } else if ((status === 3) || (status === 1)) { //Rendering widget
        this.widgets[event.name].view.start(event.options);
        this.widgets[event.name].status = 2;
    } else if (status === 2) { //Doing nothing
        console.error('[Widgets Manager] Widget' + event.name + ' already started');
    } else {
        console.error('Widget: ', this.widgets[event.name], ' event: ', event);
        throw (new Error('[Widgets Manager] in startWidget, wrong widget status'));
    }

    console.debug('[Widgets Manager] Started widget', event.name, ' its status: ', this.widgets[event.name].status);
};

module.exports = widgetsManager;