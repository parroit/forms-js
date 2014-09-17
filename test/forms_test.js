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

var forms = require('../lib/forms.js');

describe('forms', function() {
    it('is defined', function() {
        forms.should.be.a('object');
    });

    describe('bindProperty', function() {
        var $input;
        var object;
        var window;

        it('is defined', function() {
            forms.bindProperty.should.be.a('function');
        });

        before(function(done) {
            object = {
                test: 'this is a test'
            };

            jsdom.env(
                '<input id="test" name="test" type="text">', [],
                function(errors, win) {
                    $input = win.document.getElementById('test');
                    window = win;
                    forms.bindProperty(
                        $input,
                        object,
                        'test'
                    );
                    done();
                }
            );


        });



        it('listen changes on model', function(done) {
            var msg = 'changed dynamic';
            object.test = msg;
            setTimeout(function() {
                $input.value.should.be.equal(msg);
                done();
            }, 0);

        });

        it('listen changes on ui', function(done) {
            var msg = 'changed in ui';
            $input.value = msg;

            var event = new window.document.createEvent('MouseEvents');
            event.initEvent('input', true, true);
            $input.dispatchEvent(event);

            setTimeout(function() {
                object.test.should.be.equal(msg);
                done();
            }, 0);

        });
    });

    describe('bindObject', function() {
        var $input;
        var $dtInput;
        var object;
        var window;

        it('is defined', function() {
            forms.bindObject.should.be.a('function');
        });

        before(function(done) {
            object = {
                test: 'this is a test',
                dt: new Date()
            };

            jsdom.env(
                '<div id="container">' +
                '   <input id="test" name="test" type="text">' +
                '   <input id="dt" name="dt" type="date">' +
                '</div>',
                [],
                function(errors, win) {
                    $input = win.document.getElementById('test');
                    $dtInput = win.document.getElementById('dt');
                    var $container = win.document.getElementById('container');
                    window = win;
                    forms.bindObject(
                        $container,
                        object
                    );
                    done();
                }
            );


        });



        it('listen changes on model', function(done) {
            var msg = 'changed dynamic';
            var dt = new Date(2014,9,9);
            object.test = msg;
            object.dt = dt;

            setTimeout(function() {
                $input.value.should.be.equal(msg);
                $dtInput.value.should.be.equal('2014-10-09');
                done();
            }, 0);

        });

        function born() {
            var dt = new Date();
            dt.setUTCFullYear(1976);
            dt.setUTCMonth(0);
            dt.setUTCDate(3);
            dt.setUTCHours(0);
            dt.setUTCMinutes(0);
            dt.setUTCSeconds(0);
            dt.setUTCMilliseconds(0);
            return dt;
        }

        it('listen changes on ui', function(done) {
            var msg = 'changed in ui';
            var dt = born();
            $input.value = msg;
            $dtInput.value = '1976-01-03';

            var event = new window.document.createEvent('MouseEvents');
            event.initEvent('input', true, true);
            $input.dispatchEvent(event);

            event = new window.document.createEvent('MouseEvents');
            event.initEvent('input', true, true);
            $dtInput.dispatchEvent(event);

            setTimeout(function() {
                object.test.should.be.equal(msg);
                object.dt.getTime().should.be.equal(dt.getTime());
                done();
            }, 10);

        });
    });

});
