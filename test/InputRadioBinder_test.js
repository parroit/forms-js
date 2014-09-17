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

var InputRadioBinder = require('../lib/InputRadioBinder.js');

describe('InputRadioBinder', function() {
    var binderA;
    var binderB;
    var binderC;
    var $a;
    var $b;
    var $c;
    var object;
    var window;

    before(function(done) {
        object = {
            test: null
        };

        jsdom.env(
            '<input id="a" value="a" name="test" type="radio">'+
            '<input id="b" value="b" name="test" type="radio">'+
            '<input id="c" value="c" name="test" type="radio">',
            [],
            function(errors, win) {
                $a = win.document.getElementById('a');
                $b = win.document.getElementById('b');
                $c = win.document.getElementById('c');
                window = win;
                binderA = new InputRadioBinder(
                    $a,
                    object,
                    'test'
                );
                binderB = new InputRadioBinder(
                    $b,
                    object,
                    'test'
                );
                binderC = new InputRadioBinder(
                    $c,
                    object,
                    'test'
                );
                done();
            }
        );


    });

    it('is defined', function() {
        InputRadioBinder.should.be.a('function');
    });


    it('write ui value to model', function() {
        var msg = 'changed in UI';

        $a.checked = true;
        binderA.ui2Model();
        object.test.should.be.equal('a');

        $b.checked = true;
        binderB.ui2Model();
        object.test.should.be.equal('b');
    });

    it('write model value to UI', function() {
        object.test = 'c';
        binderA.model2Ui();
        binderB.model2Ui();
        binderC.model2Ui();
        $a.checked.should.be.equal(false);
        $b.checked.should.be.equal(false);
        $c.checked.should.be.equal(true);

        object.test = 'b';
        
        binderA.model2Ui();
        binderB.model2Ui();
        binderC.model2Ui();
        $a.checked.should.be.equal(false);
        $b.checked.should.be.equal(true);
        $c.checked.should.be.equal(false);



    });

    it('listen changes on model', function(done) {
        binderA.bind();
        binderC.bind();
        binderB.bind();
        object.test = 'c';
        setTimeout(function() {
            $c.checked.should.be.equal(true);
            binderA.unbind();
            binderB.unbind();
            binderC.unbind();
            done();
        }, 0);

    });

    it('listen changes on ui', function(done) {
        //console.log(1)
        binderB.bind();
        //console.log(2)
        $b.checked = true;
        //console.log(window.document.createEvent)
        var event = new window.document.createEvent('MouseEvents');
        //console.log(3)
        event.initEvent('input', true, true);
        //console.log(4)
        $b.dispatchEvent(event);
        //console.log(5)

        setTimeout(function() {
            //console.log(6)
            object.test.should.be.equal('b');
            binderB.unbind();
            done();
        }, 0);

    });

});
