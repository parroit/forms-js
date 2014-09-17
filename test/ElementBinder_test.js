/*
 * forms
 * https://github.com/parroit/forms
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var chai = require('chai');
var jsdom = require('jsdom');
chai.expect();
chai.should();

var ElementBinder = require('../lib/ElementBinder');


describe('ElementBinder', function() {
    var binder;
    var $input;
    var object;

    before(function(done) {
        object = {
            test: 'this is a test'
        };

        jsdom.env(
            '<span id="test">original</span>', [],
            function(errors, win) {
                $input = win.document.getElementById('test');

                binder = new ElementBinder(
                    $input,
                    object,
                    'test'
                );
                done();
            }
        );


    });

    it('is defined', function() {
        ElementBinder.should.be.a('function');
    });

    it('write ui value to model', function() {
        var msg = 'changed in UI';
        $input.innerHTML = msg;

        binder.ui2Model();

        object.test.should.be.equal(msg);
    });

    it('write model value to UI', function() {
        var msg = 'changed in Model';
        object.test = msg;

        binder.model2Ui();

        $input.innerHTML.should.be.equal(msg);
    });

    it('listen changes on model', function(done) {
        var msg = 'changed dynamic';
        binder.bind();
        object.test = msg;
        setTimeout(function() {
            $input.innerHTML.should.be.equal(msg);
            binder.unbind();
            done();
        }, 0);

    });

    it('stop listening changes on model', function(done) {
        var msg = 'changed second time';
        var msg2 = 'changed dynamic';
        binder.bind();
        binder.unbind();
        object.test = msg;
        setTimeout(function() {
            $input.innerHTML.should.be.equal(msg2);
            done();
        }, 0);

    });

});
