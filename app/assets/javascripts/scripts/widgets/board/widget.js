/**
 * @author Timophey Molchanov <timopheym@gmail.com>
 * @class viewerWidget
 * @extends Backbone.View
 * Date: 6/12/13 4:03 PM
 *
 */

"use strict";



var Backbone = require('Backbone'),
    $ = require('jquery.mousewheel'),
    _ = require('_'),
    i18n = require('i18n'),
    Box2D = require('Box2D'),
    Fripple = require('Fripple'),
    ItemsCollection = require('ItemsCollection'),
    ItemModel = require('ItemModel'),
    BoardModel = require('BoardModel'),
    viewerWrapperTpl = require('boardWrapperTpl'),
    Physics = require('boardPhysics');

    Backbone.Marionette = require('Backbone.Marionette');

var boardWidget = Backbone.Marionette.CollectionView.extend({
    events : {
        'click .bar .tool' : 'onToolClick',
        'click .bar .element' : 'onElementClick',
        'click .bar .control' : 'onControlClick'
    },
    collectionEvents: {
        "add": "addItem",
        "remove": "removeItem"
    },
    addItem : function (item) {
        this.physics["import"](item);
    },
    removeItem : function (/*item*/) {
//        this.physics["removeBody"](item);
    },
    onControlClick : function () {

    },
    onToolClick : function () {

    },
    onElementClick : function () {

    },
    initialize : function () {
        this.$parent = $('#Fripple-app-content');
        this.setElement('#Fripple-board');
        this.template = _.template(viewerWrapperTpl, { i18n : i18n });
        this.collection = new ItemsCollection();
        Backbone.Marionette.bindEntityEvents(this, this.collection, this.modelEvents);
        this.start(this.options);
    },

    /**
     * Start widget
     * Render widget to DOM
     * */
    start : function (options) {
        //TODO: Open next image by changing /viewer/[id] -> [Widgets Manager] Widgetviewer already started
        this.bid = options.bid;
        if ($('#Fripple-board').length === 0) { //Append element to parent
            this.$parent.html($('<div/>').attr('id', 'Fripple-board'));
            this.setElement('#Fripple-board');
        }
        var b = new BoardModel({_id: options.bid});
//        console.log(b, b.url());
        b.fetch()

        this.render();
        //Start on initing
        this.setState(1);
        this.initializePhysics();
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
        this.renderIcons();
    },
    renderIcons : function () {
        var background, name, image_path = '/assets/bar/';
        $('.bar span').each(function (index, el) {
            if (((name = $(el).data('name')) !== '') && (name !== undefined)) {
                background = 'url("'+ image_path + name + '.png") no-repeat';
                $(el).css('background', background);
            }

        });
    },
    /**
     * States list
     * 0 - stopped
     * 1 - started
     * 2 - paused
     * */
    setState : function (state) {
        this.state = state;
        if (state === 0) {
            $('.control[data-name="pause"],.control[data-name="stop"],.control[data-name="broadcast"]').hide();
            $('.control[data-name="start"]').show();
        } else if (state === 1) {
            $('.control[data-name="play"]').hide();
            $('.control[data-name="pause"],.control[data-name="stop"],.control[data-name="broadcast"]').show();
        } else if (state === 2) {
            $('.control[data-name="pause"],.control[data-name="broadcast"]').hide();
            $('.control[data-name="play"],.control[data-name="stop"]').show();
        }
    },
    initializePhysics : function () {
        var self = this, o,
            lastFrame = new Date().getTime();
//        var elements, i, _fn;
//
        window.physics = this.physics = new Physics(document.getElementById("board"));
        this.physics.collision();
        this.physics.dragNDrop();
        this.createBorders();
//            elements = Fripple.activeBoard.model.get('elements');
//
//            _fn = function (i) {
//                var o;
//
//                o = elements.models[i];
//                o.on('change:color', function () {
//                    return console.log('change');
//                });
//                o.index = +i;
//                return physics["import"](o);
//            };
//            for (i in elements.models) {
//                _fn(i);
//            }
//
        this.collection.add(o = new ItemModel({
            index: 1,
            color: "gray",
            shape: "circle",
            radius: 4,
            x: 20,
            y: 5,
            type: 'Body'
        }));

        window.gameLoop = function () {
            var dt, tm;

            tm = new Date().getTime();
            window.requestAnimationFrame(window.gameLoop);

            if (self.state === 1) {
                dt = (tm - lastFrame) / 1000;
                if (dt > 1 / 15) {
                    dt = 1 / 15;
                }
                self.physics.step(dt);
                lastFrame = tm;
            }
        };

        window.requestAnimationFrame(window.gameLoop);
    },
    createBorders : function () {
        this.physics["import"]({
            color: "red",
            type: "static",
            x: 0,
            y: 0,
            height: 50,
            width: 0.5
        });
        this.physics["import"]({
            color: "red",
            type: "static",
            x: 51,
            y: 0,
            height: 50,
            width: 0.5
        });
        this.physics["import"]({
            color: "red",
            type: "static",
            x: 0,
            y: 0,
            height: 0.5,
            width: 120
        });
        this.physics["import"]({
            color: "red",
            type: "static",
            x: 0,
            y: 25,
            height: 0.5,
            width: 120
        });
    },
    resize : function () {

    }
});


module.exports = boardWidget;



//
//    var Board = function () {
//    };
//
//
//    Board.prototype.el = "#board-container";
//
//    Board.prototype.initialize = function(model) {
//        var img, lastFrame, physics;
//
//        this.model = model;
//        Fripple.activeBoard = this;
//        $(this.el).append(this.template);
//        console.log(this.model.get('elements'), 'elements in board');
//        physics = void 0;
//        img = new Image();
//        img.addEventListener("load", function() {
//            var elements, i, _fn;
//
//            physics = window.physics = new Physics(document.getElementById("board"));
//            physics.collision();
//            physics.dragNDrop();
//            elements = Fripple.activeBoard.model.get('elements');
//            _fn = function(i) {
//                var o;
//
//                o = elements.models[i];
//                o.on('change:color', function() {
//                    return console.log('change');
//                });
//                o.index = +i;
//                return physics["import"](o);
//            };
//            for (i in elements.models) {
//                _fn(i);
//            }
//            return requestAnimationFrame(gameLoop);
//        });
//        img.src = "images/matirials/wood-fractal.jpg";
//        lastFrame = new Date().getTime();
//        window.gameLoop = function() {
//            var dt, tm;
//
//            tm = new Date().getTime();
//            requestAnimationFrame(gameLoop);
//            if (Fripple.activeBoard.mode === 'simulation') {
//                dt = (tm - lastFrame) / 1000;
//                if (dt > 1 / 15) {
//                    dt = 1 / 15;
//                }
//                physics.step(dt);
//                return lastFrame = tm;
//            }
//        };
//        this.initializeDatGUI();
//        this.initializeToolBar();
//        this.initializeSimulationBar();
//        return this.switchMode('simulation');
//    };
//
//    Board.prototype.initializeSimulationBar = function() {
//        var self;
//
//        self = this;
//        $("#board-container").append(this.simulationbar);
//        $('#simulationbar .play').click(function() {
//            $('.translate').show();
//            return self.switchMode('simulation');
//        });
//        $('#simulationbar .pause').click(function() {
//            return self.switchMode('building');
//        });
//        return $('#simulationbar .stop').click(function() {
//            $('.translate').hide();
//            return self.reset();
//        });
//    };
//
//    Board.prototype.reset = function() {
//        $('#simulationbar .play').show();
//        $('#simulationbar .stop').hide();
//        return $('#simulationbar .pause').hide();
//    };
//
//    Board.prototype.switchMode = function(mode) {
//        var $pause, $play, $stop;
//
//        $play = $('#simulationbar .play');
//        $stop = $('#simulationbar .stop');
//        $pause = $('#simulationbar .pause');
//        if (mode === 'simulation') {
//            $play.hide();
//            $stop.show();
//            $pause.show();
//        } else {
//            $play.show();
//            $pause.hide();
//        }
//        return Fripple.activeBoard.mode = mode;
//    };
//
//    Board.prototype.switchTool = function(tool) {
//        $("#toolbar span").css('border', 'none');
//        $("#toolbar > ." + tool).css('border', '1px white solid');
//        return this.currentToot = tool;
//    };
//
//    Board.prototype.initializeDatGUI = function() {
//        return this.gui = new dat.GUI();
//    };
//
//    Board.prototype.initializeToolBar = function() {
//        var board, boardsbar;
//
//        board = this;
//        boardsbar = _.template(this.boardsbar);
//        $("#board-container").append(boardsbar({
//            name: this.model.get('name')
//        }));
//        $("#board-container").append(this.toolbar);
//        $("#toolbar span").click(function() {
//            return board.switchTool($(this).attr('class'));
//        });
//        this.switchTool('cursor');
//        $(document).on('keydown', function(e) {
//            if (e.keyCode === 72) {
//                return $("#toolbar,#boardsbar,#simulationbar").toggle();
//            }
//        });
//        return $('#board').click(function(e) {
//            var el, point;
//
//            point = physics.calculateWorldPosition(e);
//            if (board.currentToot === 'cursor') {
//                physics.getByPoint(e, function(obj) {
//                    var color, model;
//
//                    if (obj !== null) {
//                        model = Fripple.activeBoard.model.get('elements').get(obj.details._id);
//                        Fripple.activeBoard.gui.destroy();
//                        Fripple.activeBoard.gui = new dat.GUI();
//                        color = Fripple.activeBoard.gui.add(model.attributes, 'color');
//                        color.onChange(function(value) {
//                            return console.log(value, 'change');
//                        });
//                        color.onFinishChange(function(value) {
//                            model.set({
//                                color: value
//                            });
//                            console.log(model.get('color'), 'final color');
//                            return model.save();
//                        });
//                        return physics.selected = obj;
//                    }
//                });
//            } else if (board.currentToot === 'eraser') {
//                physics.getByPoint(e, function(obj) {
//                    physics.removeBody(obj);
//                    return Fripple.activeBoard.model.get('elements').get(obj.details._id).destroy();
//                });
//            } else if (board.currentToot === 'circle') {
//                el = new Fripple.Models.Element({
//                    index: Fripple.activeBoard.model.get('elements').length,
//                    color: "gray",
//                    shape: "circle",
//                    radius: 4,
//                    x: point.x,
//                    y: point.y,
//                    type: 'Circle',
//                    placedIn: Fripple.activeBoard
//                });
//            } else if (board.currentToot === 'rect') {
//                el = new Fripple.Models.Element({
//                    index: Fripple.activeBoard.model.get('elements').length,
//                    color: "blue",
//                    x: point.x,
//                    y: point.y,
//                    placedIn: Fripple.activeBoard
//                });
//            }
//            if ((board.currentToot === 'rect') || (board.currentToot === 'circle')) {
//                el.save().done(function() {
//                    return console.log('hey');
//                });
//                return physics["import"](el);
//            }
//        });
//    };
