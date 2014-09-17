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

var chooser = require('../lib/binder-chooser.js');

describe('binder-chooser', function() {
    var $text;
    var $date;
    var $span;
    var $checkbox;
    var $number;

    before(function(done) {
        jsdom.env(
            '<span id="span"></span>\n'+
            '<input type="text" id="text">\n'+
            '<input type="date" id="date">\n'+
            '<input type="checkbox" id="checkbox">\n'+
            '<input type="number" id="number">\n',
            [],
            function(errors, win) {
                $text = win.document.getElementById('text');
                $date = win.document.getElementById('date');
                $span = win.document.getElementById('span');
                $checkbox = win.document.getElementById('checkbox');
                $number = win.document.getElementById('number');
                done();
            }
        );


    });

    it('is defined', function() {
        chooser.should.be.a('function');
    });

    it('identify DOM elements', function() {
        var binder = chooser($span, {string: 'value'}, 'string');
        binder.name.should.be.equal('ElementBinder');
    });

    it('identify input elements', function() {
        var binder = chooser($text, {string: 'value'}, 'string');
        binder.name.should.be.equal('InputBinder');
    });

    it('identify input date elements', function() {
        var binder = chooser($date, {date: new Date()}, 'date');
        binder.name.should.be.equal('InputDateBinder');
    });

    it('identify input checkbox elements', function() {
        var binder = chooser($checkbox, {checkbox: true}, 'checkbox');
        binder.name.should.be.equal('InputCheckboxBinder');
    });

    it('identify input number elements', function() {
        var binder = chooser($number, {number: true}, 'number');
        binder.name.should.be.equal('InputNumberBinder');
    });

});
