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

var InputCheckboxBinder = require('../lib/InputCheckboxBinder.js');

describe('InputCheckboxBinder', function() {
    var binder;
    var $input;
    var object;
    var window;

    before(function(done) {
        object = {
            test: false
        };

        jsdom.env(
            '<input id="test" name="test" type="date">', [],
            function(errors, win) {
                $input = win.document.getElementById('test');
                window = win;
                binder = new InputCheckboxBinder(
                    $input,
                    object,
                    'test'
                );
                done();
            }
        );


    });

    it('is defined', function() {
        InputCheckboxBinder.should.be.a('function');
    });


    it('write ui value to model', function() {
        var msg = 'changed in UI';

        $input.checked = true;
        binder.ui2Model();
        object.test.should.be.equal(true);

        $input.checked = false;
        binder.ui2Model();
        object.test.should.be.equal(false);
    });

    it('write model value to UI', function() {
        object.test = true;
        binder.model2Ui();
        $input.checked.should.be.equal(true);

        object.test = false;
        binder.model2Ui();
        $input.checked.should.be.equal(false);


    });

    it('listen changes on model', function(done) {
        binder.bind();
        object.test = true;
        setTimeout(function() {
            $input.checked.should.be.equal(true);
            binder.unbind();
            done();
        }, 0);

    });

    it('listen changes on ui', function(done) {
        binder.bind();
        $input.checked = false;

        var event = new window.document.createEvent('MouseEvents');
        event.initEvent('input', true, true);
        $input.dispatchEvent(event);

        setTimeout(function() {
            object.test.should.be.equal(false);
            binder.unbind();
            done();
        }, 0);

    });

});
