/*
 * forms
 * https://github.com/parroit/forms
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var dtUtils  = require('./dt-utils');

module.exports = InputRadioBinder;

var InputBinder = require('./InputBinder');

function InputRadioBinder(elm, object, name) {
    InputBinder.call(this, elm, object, name);

}

InputRadioBinder.prototype = Object.create(InputBinder.prototype);

InputRadioBinder.prototype.model2Ui = function() {
    this.elm.checked = this.object[this.name];

};

InputRadioBinder.prototype.ui2Model = function() {

    this.object[this.name] = this.elm.checked;
};


