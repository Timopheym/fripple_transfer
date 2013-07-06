/**
 * @author Timophey Molchanov <timopheym@gmail.com>
 * @class skinView
 * @extends Backbone.View
 * Date: 5/31/13 4:04 PM
 */
    "use strict";
var $ = require('$'),
    _ = require('_'),
    functionsHelper = require('functionsHelper'),
    Fripple = require('Fripple'),
    objectModel = require('objectModel'),
    elementModel = require('elementModel'),
    i18n = require('i18n'),
    dat  = require('dat'),
    backbone = require('backbone'),
    paper = require('paper');

var skinView = backbone.View.extend({
    addCircle : function () {
        this.addObject({
            name  : "Объект #" + this.listOfObjects.length,
            type  : 'Circle',
            radius: 30,
            center: [100, 100],
            style : {
                strokeColor : '#000000',
                fillColor   : '#000000'
            }
        });
    },
    addRectangle : function () {
        this.addObject({
            name  : "Объект #" + Math.round(Math.random() * 10),
            type  : 'Rectangle',
            width: 30,
            height: 30,
            center: [100, 100],
            style : {
                strokeColor : '#000000',
                fillColor   : '#000000'
            }
        });
    },
    paper : paper,
    initialize : function () {
        console.debug('[Initialize] Skin View');
        this.model = elementModel;
        this.listOfObjects = []; //Array of arrays

//        this.model.set('objects', {});

//        this.model.set('objects', this.model.get('objects') || {});
        this.paper.setup($('canvas')[0]);

        this.initialDragnDrop();

        this.gui = new dat.GUI();
        //DEBUG ONLY!
        console.log(this.exportObjects);
        var self = this;
        window.getPaperObjects = function () {
            console.debug(JSON.stringify(self.exportObjects()));
        };
    },
    exportObjects : function () {
        var json = '';
        console.debug('<==Start exporting objects==>');
        _.forOwn(elementModel.get('objects'), function (obj) {
            console.log(obj);
            json = obj.get('paperObject').toJSON();
        });
        return json;
    },
    addObject : function (obj) {
        //Generate uniq id
        var paper_obj,
            paper_group,
            text_point,
            name,
            id = obj.id = functionsHelper.guid();
        //Define and draw object
        if (obj.type === "Circle") {
            paper_obj = new paper.Path.Circle({
                radius : obj.radius,
                center : obj.center,
                data   : {
                    id : id
                }
            });

            text_point =
                [obj.center[0] - (obj.name.length * 2),
                 obj.center[1]];
        } else if (obj.type === "Rectangle") {
            paper_obj = new paper.Path.Rectangle({
                height : obj.height,
                width : obj.width,
                center : obj.center
            });

            text_point = [obj.width / 2, obj.height / 2];
        } else {
            throw new Error('[Skin view] wrong object type ' + obj.type + ' in addObject.');
        }

        paper_obj.style = obj.style;

        //Adding name

        name = new paper.PointText(text_point);
        name.fillColor = 'white';
        name.content = obj.name;


        paper_group = new paper.Group([paper_obj, name]);
        paper_group.data.id = id;
        // Not nessesory - just creating a block with objects list
//        Fripple.on('logicView:loaded',function(){
//            //Add to toolbox
//            Fripple.elementBuilderView.logicView.addObject({
//                type  : obj.type,
//                id    : id,
//                title : obj.name
//            });
//        });

        //Add to skin model
        obj.paperObject = paper_obj;
        obj.fillColor = obj.style.fillColor;
        obj.strokeColor = obj.style.strokeColor;
        obj.skin = this;
        elementModel.get('objects')[id] = new objectModel['Circle'](obj);
        this.listOfObjects.push([obj.name, id]);
        this.paper.view.draw();
    },
    setTool : function (tool) {
        if (this.paper.tool && this.paper.tool.deactivate) this.paper.tool.deactivate();

        if (tool.init) {
            tool.init();
        } else {
            tool.activate();
        }
    },
    initialPencil : function () {
        this.paintTool = new this.paper.Tool();
        console.log(this.paintTool);
        this.paintTool.onMouseDown = function () {
            this.path = new this.paper.Path();
            this.path.strokeWidth = 2;
            this.path.strokeColor = '#000000';
        };

        this.paintTool.onMouseDrag = function (event) {
            this.path.add(event.point);
        };

        this.paintTool.onMouseUp = function () {
            this.path.simplify();
        };
    },
    initialDragnDrop : function (o) {
        var self = this,
            path = null,
            controller = null,
            obj = o || this.paper.project,
            getGroup = function (item) {
                if (item instanceof self.paper.Group) {
                    return item;
                }
                else {
                    return getGroup(item._parent);
                }
            };

        this.handTool = new this.paper.Tool();

        this.handTool.onMouseUp = function (event) {
            //TODO: Решить баг с оффсетом
            elementModel.get('objects')[path.data.id].set('center', [event.point.x, event.point.y]);
        };

        this.handTool.onMouseDown = function (event) {
            var id, o, hitResult = obj.hitTest(event.point),
                addGuiController = function (obj, property, isColor) {
                    if (isColor !== undefined && isColor) {
                        controller = self.gui.addColor(obj.attributes, property)
                            .onChange(function (value) {
                                obj.trigger('change:' + property, value);
                                obj.set(property, value);
                            });
                    }
                    else {
                        controller = self.gui.add(obj.attributes, property);
                    }
                    controller.onFinishChange(function (value) {
                        obj.trigger('change:' + property, value);
                        obj.set(property, value);
                    });
                };
            if (hitResult !== undefined) {
                if (hitResult !== null) {
                    if (path !== null) {
                        path.selected = false;
                    }

                    path = getGroup(hitResult.item).bringToFront();
                    path.selected = true;

                    self.gui.destroy();
                    self.gui = new dat.GUI();
                    id = path.data.id;
                    o = elementModel.get('objects')[id];

                    addGuiController(o, 'name');
                    addGuiController(o, 'fillColor', true);
                    addGuiController(o, 'strokeColor', true);
                    addGuiController(o, 'radius');
                }
            }
            else {
                path = null;
            }
        };
        this.handTool.onMouseDrag = function (event) {
            if (path !== null) {
                path.position.x = event.point.x;
                path.position.y = event.point.y;
            }
        };
    }
});

module.exports = skinView;