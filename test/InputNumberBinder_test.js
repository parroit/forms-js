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

var InputNumberBinder = require('../lib/InputNumberBinder.js');

describe('InputNumberBinder', function() {
    var binder;
    var $input;
    var object;
    var window;

    before(function(done) {
        object = {
            test: 42
        };

        jsdom.env(
            '<input id="test" name="test" type="number">', [],
            function(errors, win) {
                $input = win.document.getElementById('test');
                window = win;
                binder = new InputNumberBinder(
                    $input,
                    object,
                    'test'
                );
                done();
            }
        );


    });

    it('is defined', function() {
        InputNumberBinder.should.be.a('function');
    });

    it('write ui value to model', function() {

        $input.value = 41;

        binder.ui2Model();

        object.test.should.be.equal(41);
    });

    it('write model value to UI', function() {
        object.test = 40;

        binder.model2Ui();

        $input.value.should.be.equal('40');
    });

    it('listen changes on model', function(done) {
        binder.bind();
        object.test = 39;
        setTimeout(function() {
            $input.value.should.be.equal('39');
            binder.unbind();
            done();
        }, 0);

    });

    it('listen changes on ui', function(done) {
        var msg = 38.5;
        binder.bind();
        $input.value = msg;

        var event = new window.document.createEvent('MouseEvents');
        event.initEvent('input', true, true);
        $input.dispatchEvent(event);

        setTimeout(function() {
            object.test.should.be.equal(38.5);
            binder.unbind();
            done();
        }, 0);

    });

});
