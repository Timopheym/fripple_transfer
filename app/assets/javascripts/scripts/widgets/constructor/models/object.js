"use strict";

var $ = require('$'),
    _ = require('_'),
    Fripple = require('Fripple'),
    backbone = require('backbone');

var objectsModel = {
    'Circle' : backbone.Model.extend({

        initialize : function (config) {
            var self = this, val, name, group, circle,
                skin = config.skin,
                paper = skin.paper;

            this.block = false;
            console.debug('[Initialize] Object Circle model', config);

            this.on('change:center', function (model, val) {
                this.get('paperObject').setPosition(val);
                paper.view.draw();
            });
            this.on('change:fillColor', function (val) {
                this.get('paperObject').style.fillColor = val;
                paper.view.draw();
            });
            this.on('change:stokeColor', function (val) {
                this.get('paperObject').style.strokeColor = val;
                paper.view.draw();
            });
            this.on('change:name', function (val) {
                group = this.get('paperObject')._parent;
                group.removeChildren(1);
                name = new paper.PointText(self.get('center')[0] - val.length, self.get('center')[1]);
                name.fillColor = 'white';
                name.content = val;
                group.insertChild(1, name);

                _.each(skin.listOfObjects, function (object) {
                    if (object[1] === self.id) {
                        object[0] = val;
                    }
                });
                paper.view.draw();
            });
            this.on('change:radius', function (val) {
                group = this.get('paperObject')._parent;
                group.removeChildren(0, 1);
                circle = paper.Path.Circle({
                    center : self.get('center'),
                    radius : self.get('radius')
                });
                group.insertChild(0, circle);
                this.set('paperObject', circle);
                this.get('paperObject').style.fillColor = this.get('fillColor');
                this.get('paperObject').style.strokeColor = this.get('strokeColor');
                paper.view.draw();
            });
//            this.on('change', function () {
//
//                for (var prop in this.changed) {
//                    val = this.changed[prop];
//                    if (prop === 'center') {
//                        this.get('paperObject').setPosition(val);
//                    } else if (prop === 'fillColor') {
//                        this.get('paperObject').style.fillColor = val;
//                    } else if (prop === 'strokeColor') {
//                        this.get('paperObject').style.strokeColor = val;
//                    } else if (prop === 'name') {
//                        group = this.get('paperObject')._parent;
//                        group.removeChildren(1);
//                        name = new paper.PointText(self.get('center')[0] - val.length, self.get('center')[1]);
//                        name.fillColor = 'white';
//                        name.content = val;
//                        group.insertChild(1, name);
//
//                        _.each(skin.listOfObjects, function (object) {
//                            if (object[1] === self.id) {
//                                object[0] = val;
//                            }
//                        });
//
//                    } else if (prop === 'radius') {
//                        group = this.get('paperObject')._parent;
//                        group.removeChildren(0, 1);
//                        circle = paper.Path.Circle({
//                            center : self.get('center'),
//                            radius : self.get('radius')
//                        });
//                        group.insertChild(0, circle);
//                        this.set('paperObject', circle);
//                        this.get('paperObject').style.fillColor = this.get('fillColor');
//                        this.get('paperObject').style.strokeColor = this.get('strokeColor');
//                    } else {
//                        throw (new Error('Wrong property ' + prop + ' for object ' + self));
//                    }
//                }
//                paper.view.draw();
//            });
        }
    })
};

module.exports = objectsModel;