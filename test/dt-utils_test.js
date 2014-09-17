/*
 * forms
 * https://github.com/parroit/forms
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var chai = require('chai');
chai.expect();
chai.should();

var dtUtils = require('../lib/dt-utils.js');

describe('dtUtils', function() {
    it('is defined', function() {
        dtUtils.should.be.a('object');
    });

    describe('toDOMTime', function() {
        it('is defined', function() {
            dtUtils.toDOMTime.should.be.a('function');
        });

        it('return a string', function() {
            var dt = new Date(2014,11,25,1,20);
            var value = dtUtils.toDOMTime(dt);

            value.should.be.equal('01:20');
        });

        it('use 24h format', function() {
            var dt = new Date(2014,11,25,13,25);
            var value = dtUtils.toDOMTime(dt);

            value.should.be.equal('13:25');
        });
    });

    describe('toDOMDate', function() {
        it('is defined', function() {
            dtUtils.toDOMDate.should.be.a('function');
        });

        it('return a string', function() {
            var dt = new Date(2014,11,25);
            var value = dtUtils.toDOMDate(dt);

            value.should.be.equal('2014-12-25');
        });

        it('pad month and day format', function() {
            var dt = new Date(2014,1,5);
            var value = dtUtils.toDOMDate(dt);

            value.should.be.equal('2014-02-05');
        });
    });

    describe('fromDOMDate', function() {
        it('is defined', function() {
            dtUtils.fromDOMDate.should.be.a('function');
        });

        it('return a string', function() {
            var value = dtUtils.fromDOMDate('2014-12-25');

            value.getTime().should.be.equal(1419465600000);
        });

    });

});
