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
var utils = require('./utils');
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
            utils.later(function() {
                $input.value.should.be.equal(msg);
            }, done);

        });

        it('listen changes on ui', function(done) {
            var msg = 'changed in ui';
            $input.value = msg;

            var event = new window.document.createEvent('MouseEvents');
            event.initEvent('input', true, true);
            $input.dispatchEvent(event);

            utils.later(function() {
                object.test.should.be.equal(msg);

            }, done);

        });
    });

    describe('nested array', function() {
        var object;
        var $name;
        var $surname;
        var window;

        before(function(done) {
            object = {
                test: 'this is a test',
                sub: [{
                    name: 'Andrea',
                    surname: 'Parodi'
                }, {
                    name: 'Pino',
                    surname: 'Verdi'
                }]
            };

            jsdom.env(
                '<div id="container">' +
                '   <div id="sub">' +
                '       <input class="name" type="text">' +
                '       <span class="surname"/>' +
                '   </div>' +
                '</div>', [],

                function(errors, win) {
                    var $container = win.document.getElementById('container');
                    window = win;
                    forms.bindObject(
                        $container,
                        object
                    );
                    $name = win.document.getElementsByClassName('name');
                    $surname = win.document.getElementsByClassName('surname');

                    done();
                }
            );


        });

        it('render all array contents', function() {

            $name.length.should.be.equal(2);
            $surname.length.should.be.equal(2);

        });

        it('listen changes on model', function(done) {
            var msg = 'changed dynamic';
            object.sub[1].surname = msg;
            utils.later(function() {
                $surname[1].innerHTML.should.be.equal(msg);
            }, done);

        });


        it('listen changes on ui', function(done) {
            var msg = 'changed in ui';
            $name[1].value = msg;

            var event = new window.document.createEvent('MouseEvents');
            event.initEvent('input', true, true);
            $name[1].dispatchEvent(event);

            utils.later(function() {

                object.sub[1].name.should.be.equal(msg);
                $name[1].value = 'Pino';
            }, done);

        });

        function checkDOMStatus(names, done){
            utils.later(function(){
                var $name = window.document.getElementsByClassName('name');

                $name.length.should.be.equal(names.length);

                var i = 0;
                var l = names.length;
                for (; i<l; i++) {
                    $name[i].value.should.be.equal(names[i]);
                }

            },done);
        }

        it('listen for object pushed', function(done) {
            object.sub.push({
                name: 'Giorgio',
                surname: 'Parodi'
            });
            checkDOMStatus(['Andrea','Pino','Giorgio'], done);
        });

        it('listen for object spliced at end', function(done) {
            object.sub.splice(2,1);
            //console.dir(object)

            checkDOMStatus(['Andrea','Pino'], done);
        });

        it('listen for new object setted', function(done) {
            object.sub[2] = {
                name: 'Giorgio',
                surname: 'Parodi'
            };
            checkDOMStatus(['Andrea','Pino','Giorgio'], done);

        });

        it('listen for object spliced at middle', function(done) {
            global.loggo = true;
            object.sub.splice(1,1);

            checkDOMStatus(['Andrea','Giorgio'], done);

        });

        it('listen for existing object setted', function(done) {

            object.sub[0] = {
                name: 'Gigi',
                surname: 'Bubu'
            };

            checkDOMStatus(['Gigi','Giorgio'], done);

        });

        it('listen for existing object setted', function(done) {

            object.sub.push({
                name: 'Laura',
                surname: 'Gialli'
            });

            delete object.sub[1];



            checkDOMStatus(['Gigi','Laura'], done);

        });


    });

    describe('nested object', function() {
        var object;
        var $name;
        var $surname;
        var window;

        before(function(done) {
            object = {
                test: 'this is a test',
                sub: {
                    name: 'Andrea',
                    surname: 'Parodi'
                }
            };

            jsdom.env(
                '<div id="container">' +
                '   <div id="sub">' +
                '       <input id="name" name="name" type="text">' +
                '       <span id="surname"/>' +
                '   </div>' +
                '</div>', [],

                function(errors, win) {
                    $name = win.document.getElementById('name');
                    $surname = win.document.getElementById('surname');
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
            object.sub.surname = msg;
            utils.later(function() {
                $surname.innerHTML.should.be.equal(msg);

            }, done);

        });

        it('listen changes on ui', function(done) {
            var msg = 'changed in ui';
            $name.value = msg;

            var event = new window.document.createEvent('MouseEvents');
            event.initEvent('input', true, true);
            $name.dispatchEvent(event);

            utils.later(function() {
                object.sub.name.should.be.equal(msg);
            }, done);

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
                '</div>', [],
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
            var dt = new Date(2014, 9, 9);
            object.test = msg;
            object.dt = dt;

            utils.later(function() {
                $input.value.should.be.equal(msg);
                $dtInput.value.should.be.equal('2014-10-09');
            }, done);

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

            utils.later(function() {
                object.test.should.be.equal(msg);
                object.dt.getTime().should.be.equal(dt.getTime());
            }, done);

        });
    });

});
