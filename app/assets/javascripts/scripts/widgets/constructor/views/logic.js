/**
 * @author Timophey Molchanov <timopheym@gmail.com>
 * @class LogicViewer
 * @extends Backbone.View
 * Date: 5/31/13 4:04 PM
 */

"use strict";

var $ = require('$'),
    _ = require('_'),
    Fripple = require('Fripple'),
    Blockly = require('Blockly'),
    generator = require('generator'),
    utils = require('utils'),
    constructorBlocks = require('constructorBlocks'),
    defaultBlocks = require('defaultBlocks'),
    i18n = require('i18n'),
    backbone = require('backbone'),
    paper = require('paper');

var logicView = backbone.View.extend({
    pidList : [],
    reset : function () {
        Blockly.mainWorkspace.traceOn(false);
    },
    getCode : function () {
        var code = Blockly.Generator.workspaceToCode('JavaScript');
        return code;
    },
    execute : function () {
        Blockly.mainWorkspace.traceOn(true);
        var code = 'Fripple.trigger("getWidget", { name : "constructor", callback : function (constructor) {' +
            'var canvas = constructor.skinView.paper.view;' +
            'constructor.state = 1;' +
            'var element = constructor.element;' +
            '\n' + this.getCode() + '' +
            '\nelement.draw();}});';
        console.log(code)
        try {
            eval(code);
        } catch (e) {
            console.error('Element execute error: ', e);
        }
    },
    initialize : function (model) {
        var self = this, m, rtl = document.body.parentNode.dir === 'rtl',
            toolbox = document.getElementById('toolbox');

        console.debug('[Initialize] Logic (Blocky) View');
        this.model = model;
        Blockly.Apps = {};
        Blockly.inject(document.getElementById('blockly'),
            {path: '../../',
                rtl: rtl,
                toolbox: toolbox,
                trashcan: true});
        Blockly.JavaScript.INFINITE_LOOP_TRAP = '  Blockly.Apps.checkTimeout(%1);\n';
        this.onResize();
        window.addEventListener('resize', this.onResize);

        this.loadXML(this.textXML);
        Blockly.Apps.checkTimeout = function () {

        };


        /**
         * Highlight the block (or clear highlighting).
         * @param {?string} id ID of block that triggered this action.
         */
        Blockly.Apps.highlight = function (id) {
            if (id) {
                m = id.match(/^block_id_(\d+)$/);
                if (m) {
                    id = m[1];
                }
            }
            Blockly.mainWorkspace.highlightBlock(id);
        };

        /** DEBUG METHODS **/
        window.getBlocklyXml = function () {
            console.debug(self.getXML());
        };
        window.setBlocklyXml = function (xmlText) {
            self.loadXML(xmlText);
            console.debug('Xml rendered');
        };
    },
    getXML : function () {
        var xmlDom = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
        return Blockly.Xml.domToPrettyText(xmlDom);
    },
    loadXML : function (xmlText) {
        var xmlDom = null;
        try {
            xmlDom = Blockly.Xml.textToDom(xmlText);
        } catch (e) {
            throw (new Error('Error while parsing Blockly XML text' + e));
        }
        if (xmlDom) {
            Blockly.mainWorkspace.clear();
            Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xmlDom);
        }
    },
    addObject : function (obj) {
        $('#objectsToolbox').append(
            '<block type="fripple_object' + obj.type + '">' +
//                '<value name="metaId">'+obj.id+'</value>' +
//                '<title name="NAME">'+obj.title+'</title>' +
                '</block>');
        var toolbox = document.getElementById('toolbox');
        $('.blocklyToolboxDiv').html('');
        Blockly.toolbox =  toolbox;
        Blockly.Toolbox.init();
    },
    onResize : function () {
        var blocklyDiv = document.getElementById('blockly');
        blocklyDiv.style.width = (window.innerWidth - blocklyDiv.offsetLeft - 18) +
            'px';
        blocklyDiv.style.height = (window.innerHeight - 22) + 'px';
    },
    textXML : '<xml><block type="variables_set" inline="false" x="-11" y="-11"><title name="VAR">y</title><value name="VALUE"><block type="math_number"><title name="NUM">0</title></block></value><next><block type="fripple_frame"><statement name="DO"><block type="fripple_moveObject" inline="false"><value name="obj">' +
        '</value><value name="x"><block type="math_number"><title name="NUM">0</title></block></value><value name="y"><block type="variables_get"><title name="VAR">y</title></block></value><next><block type="variables_set" inline="false"><title name="VAR">y</title><value name="VALUE"><block type="math_arithmetic" inline="true"><title name="OP">ADD</title><value name="A"><block type="variables_get"><title name="VAR">y</title></block></value><value name="B"><block type="math_number"><title name="NUM">1</title></block></value></block></value></block></next></block></statement></block></next></block> </xml>'
});

module.exports = logicView;