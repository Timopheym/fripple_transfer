"use strict";

var Box2D = require('Box2D'),
    box2dshim = require('box2dshim'),
    Body = require('boardBody');

var Physics = window.Physics = function (element, scale) {
    var gravity = new b2Vec2(0, 9.8);
    this.world = new b2World(gravity, true);
    this.element = element;
    this.context = element.getContext("2d");
    this.scale = scale || 30;
    this.dtRemaining = 0;
    this.stepAmount = 1 / 60;
};

Physics.prototype.export = function (id) {
    if (id != "undefined") {
        //TODO GetElementById
    }
    else {
        //TODO Export all elements as JSON Array
    }
};

Physics.prototype.import = function (obj) {
    if (typeof obj !== 'Array') {
        new Body(this, obj.attributes || obj);
    }
    else {
        for (var i in obj) {
            new Body(this, obj[i].attributes || obj[i]);
        }
    }
};
Physics.prototype.step = function (dt) {
    this.dtRemaining += dt;
    while (this.dtRemaining > this.stepAmount) {
        this.dtRemaining -= this.stepAmount;
        this.world.Step(this.stepAmount,
            8, // velocity iterations
            3); // position iterations
    }
    if (this.debugDraw) {
        this.world.DrawDebugData();
    } else {
        this.context.clearRect(0, 0, this.element.width, this.element.height);

        var body,
            obj = this.world.GetBodyList();

        this.context.save();
        this.context.scale(this.scale, this.scale);
        while (obj) {

            body = obj.GetUserData();
            if (body) {
                body.draw(this.context);
            }

            obj = obj.GetNext();
        }
        this.context.restore();
    }
}

Physics.prototype.debug = function () {
    this.debugDraw = new b2DebugDraw();
    this.debugDraw.SetSprite(this.context);
    this.debugDraw.SetDrawScale(this.scale);
    this.debugDraw.SetFillAlpha(0.3);
    this.debugDraw.SetLineThickness(1.0);
    this.debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    this.world.SetDebugDraw(this.debugDraw);
};

Physics.prototype.click = function (callback) {
    var self = this;

    function handleClick(e) {
        e.preventDefault();
        var point = {
            x: (e.offsetX || e.layerX) / self.scale,
            y: (e.offsetY || e.layerY) / self.scale
        };

        self.world.QueryPoint(function(fixture) {
            callback(fixture.GetBody(),
                fixture,
                point);
        },point);
    }

    this.element.addEventListener("mousedown",handleClick);
    this.element.addEventListener("touchstart",handleClick);
};

Physics.prototype.collision = function () {

    this.listener = new Box2D.Dynamics.b2ContactListener();
    this.listener.PostSolve = function (contact, impulse) {
        var bodyA = contact.GetFixtureA().GetBody().GetUserData(),
            bodyB = contact.GetFixtureB().GetBody().GetUserData();

        if (bodyA.contact) {
            bodyA.contact(contact, impulse, true)
        }
        if (bodyB.contact) {
            bodyB.contact(contact, impulse, false)
        }

    };
    this.world.SetContactListener(this.listener);
};

Physics.prototype.removeBody = function (body){
    this.world.DestroyBody(body.body);
};
Physics.prototype.getByPoint = function (e, callback){
    e.preventDefault();
    var point = this.calculateWorldPosition(e);
    this.world.QueryPoint(function (fixture) {
        callback(fixture.GetBody().GetUserData());
    }, point);
};
Physics.prototype.calculateWorldPosition = function (e) {
    var self = this;
    return {
        x: (e.offsetX || e.layerX) / self.scale,
        y: (e.offsetY || e.layerY) / self.scale
    };
};
Physics.prototype.dragNDrop = function () {
    var self = this;
    var obj = null;
    var joint = null;
    //Select
    this.element.addEventListener("mousedown", function (e) {
        self.getByPoint(e, function (aObj) {
            obj = aObj;
        });
    });

    this.element.addEventListener("mousemove", function (e) {
        if (!obj) {
            return;
        }
        var point = self.calculateWorldPosition(e);

        if (!joint) {
            var jointDefinition = new Box2D.Dynamics.Joints.b2MouseJointDef();

            jointDefinition.bodyA = self.world.GetGroundBody();
            jointDefinition.bodyB = obj.body;
            jointDefinition.target.Set(point.x, point.y);
            jointDefinition.maxForce = 100000;
            jointDefinition.timeStep = self.stepAmount;
            joint = self.world.CreateJoint(jointDefinition);
        }

        joint.SetTarget(new b2Vec2(point.x, point.y));
    });

    this.element.addEventListener("mouseup", function (e) {
        obj = null;
        if (joint) {
            self.world.DestroyJoint(joint);
            joint = null;
        }
    });

};

module.exports = Physics;
