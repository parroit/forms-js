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

var InputDateTimeBinder = require('../lib/InputDateTimeBinder.js');

describe('InputDateTimeBinder', function() {
    var binder;
    var $input;
    var object;
    var window;

    before(function(done) {
        object = {
            test: new Date()
        };

        jsdom.env(
            '<input id="test" name="test" type="datetime-locale">', [],
            function(errors, win) {
                $input = win.document.getElementById('test');
                window = win;
                binder = new InputDateTimeBinder(
                    $input,
                    object,
                    'test'
                );
                done();
            }
        );


    });

    it('is defined', function() {
        InputDateTimeBinder.should.be.a('function');
    });

    function born() {
        var dt = new Date(1976,0,3,13,41,10,0);
        return dt;
    }
    it('write ui value to model', function() {
        var msg = 'changed in UI';
        $input.value = '1976-01-03 13:41:10';

        binder.ui2Model();

        object.test.getTime().should.be.equal(born().getTime());
    });

    it('write model value to UI', function() {
        object.test = born();

        binder.model2Ui();

        $input.value.slice(0,19).should.be.equal('1976-01-03T13:41:10');
    });

    it('listen changes on model', function(done) {
        binder.bind();
        object.test = born();
        setTimeout(function() {
            $input.value.slice(0,19).should.be.equal('1976-01-03T13:41:10');
            binder.unbind();
            done();
        }, 0);

    });

    it('listen changes on ui', function(done) {
        var msg = '1976-01-03 13:41:10';
        binder.bind();
        $input.value = msg;

        var event = new window.document.createEvent('MouseEvents');
        event.initEvent('input', true, true);
        $input.dispatchEvent(event);

        setTimeout(function() {

            object.test.getTime().should.be.equal(born().getTime());
            binder.unbind();
            done();
        }, 0);

    });

});
