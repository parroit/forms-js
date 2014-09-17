/*
 * forms
 * https://github.com/parroit/forms
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var chai = require('chai');
var jsdom = require('jsdom-nocontextifiy');
chai.expect();
chai.should();

var InputBinder = require('../lib/InputBinder.js');

describe('InputBinder', function() {
    var binder;
    var $input;
    var object;
    var window;

    before(function(done) {
        object = {
            test: 'this is a test'
        };

        jsdom.env(
            '<input id="test" name="test" type="text">', [],
            function(errors, win) {
                $input = win.document.getElementById('test');
                window = win;
                binder = new InputBinder(
                    $input,
                    object,
                    'test'
                );
                done();
            }
        );


    });

    it('is defined', function() {
        InputBinder.should.be.a('function');
    });

    it('write ui value to model', function() {
        var msg = 'changed in UI';
        $input.value = msg;

        binder.ui2Model();

        object.test.should.be.equal(msg);
    });

    it('write model value to UI', function() {
        var msg = 'changed in Model';
        object.test = msg;

        binder.model2Ui();

        $input.value.should.be.equal(msg);
    });

    it('listen changes on model', function(done) {
        var msg = 'changed dynamic';
        binder.bind();
        object.test = msg;
        setTimeout(function() {
            $input.value.should.be.equal(msg);
            binder.unbind();
            done();
        }, 0);

    });

    it('listen changes on ui', function(done) {
        var msg = 'changed in ui';
        binder.bind();
        $input.value = msg;

        var event = new window.document.createEvent('MouseEvents');
        event.initEvent('input', true, true);
        $input.dispatchEvent(event);

        setTimeout(function() {
            object.test.should.be.equal(msg);
            binder.unbind();
            done();
        }, 0);

    });

});
