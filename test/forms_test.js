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

var forms = require('../lib/forms.js');

describe('forms', function(){
    it('is defined', function(){
      forms.should.be.a('function');
    });

});
