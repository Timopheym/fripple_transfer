'use strict';
var Blockly = require('Blockly'),
    Fripple = require('Fripple');

/*Fripple*/

/** Objects */
Blockly.Language.fripple_object = {
    // Block for moving forward.
    helpUrl: '',
    init: function () {
        var self = this;
        this.setColour(160);
        Fripple.trigger('getWidget', { name : 'constructor', callback : function (constructor) {
            self.appendDummyInput().appendTitle(new Blockly.FieldDropdown(constructor.skinView.listOfObjects), 'OBJ');
            self.setTooltip('Circle');
            self.setOutput(true, 'Object');
        }
        });
        // Get methods list

    }
};


Blockly.JavaScript.fripple_object = function () {
    // Generate JavaScript for moving forward.
    var id = this.getTitleValue('OBJ');
    return ['var obj = element.get("objects")["' + id + '"] \n', 0];
};

/** End of objects*/
Blockly.Language.fripple_moveObject = {
    // Block for moving forward.
    helpUrl: '',
    init: function () {

        this.setColour(160);
        this.appendValueInput('obj')
            .setCheck('Object')
            .appendTitle("Передвинуть объект");
        this.appendValueInput('x')
            .setCheck('Number')
            .appendTitle('x');
        this.appendValueInput('y')
            .setCheck('Number')
            .appendTitle('y');
        this.setTooltip('Set circle position');

        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

Blockly.JavaScript.fripple_moveObject = function () {

    var obj = Blockly.JavaScript.valueToCode(this, 'obj', 0),
        x = Blockly.JavaScript.valueToCode(this, 'x', 1),
        y = Blockly.JavaScript.valueToCode(this, 'y', 2);
    obj = obj.slice(1, -1);
    return [obj + '\n' +
           'obj.set("center",[' + x + ',' + y + '])\n' +
           'canvas.draw()\n', 1];
};


Blockly.Language.fripple_getArea = {
    // Block for moving forward.
    helpUrl: '',
    init: function () {
        this.setColour(190);
        this.appendDummyInput()
            .appendTitle("Что где?");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip("Получить значения окружения");
    }
};

Blockly.JavaScript.fripple_getArea = function () {
    // Generate JavaScript for moving forward.
    return 'Maze.moveForward(\'block_id_' + this.id + '\');\n';
};

Blockly.Language.fripple_debug = {
    // Block for moving forward.
    helpUrl: '',
    init: function () {
        this.setColour(190);
        this.appendValueInput('obj')
            .appendTitle("Отладка");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip("Метод отладки");
    }
};

Blockly.JavaScript.fripple_debug = function () {
    // Generate JavaScript for moving forward.

    var obj = Blockly.JavaScript.valueToCode(this, 'obj', 0);

    obj = obj.slice(1, -1);
    return ['console.debug(' + obj + ')\n', 1];
};

Blockly.Language.fripple_frame = {
    // Block for moving forward.
    helpUrl: '',
    init: function () {
        this.appendStatementInput('DO')
            .appendTitle('ЦИКЛ');

        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

Blockly.JavaScript.fripple_frame = function () {
    // Generate JavaScript for moving forward.
    var body = Blockly.JavaScript.valueToCode(this, 'DO', 0);
    body = body.slice(1, -1);
    console.log(body, 'BODY!');
    return 'element.draw = function(){\n' +
            'if (constructor.state !== 1){return;}\n' +
            '' + body +
            '\nwindow.requestAnimationFrame(element.draw)' +
           '}';
};
