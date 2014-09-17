/*
 * forms
 * https://github.com/parroit/forms
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var dtUtils  = require('./dt-utils');

module.exports = InputNumberBinder;

var InputBinder = require('./InputBinder');

function InputNumberBinder(elm, object, name) {
    InputBinder.call(this, elm, object, name);

}

InputNumberBinder.prototype = Object.create(InputBinder.prototype);

InputNumberBinder.prototype.model2Ui = function() {
    var value = this.object[this.name];
    if (value === 0 || value) {
        value = value.toString();
    }
    this.elm[this.DOMProperty] = value;

};

InputNumberBinder.prototype.ui2Model = function() {
    var value = parseFloat(this.elm[this.DOMProperty]);
    this.object[this.name] = value;
};


