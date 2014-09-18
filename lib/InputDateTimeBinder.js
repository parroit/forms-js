/*
 * forms
 * https://github.com/parroit/forms
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var dtUtils  = require('./dt-utils');

module.exports = InputDateBinder;

var InputBinder = require('./InputBinder');

function InputDateBinder(elm, object, name) {
    InputBinder.call(this, elm, object, name);
}

InputDateBinder.prototype = Object.create(InputBinder.prototype);

InputDateBinder.prototype.model2Ui = function() {
    var dtValue = this.object[this.name];
    var value = dtUtils.toIsoString(dtValue);

    this.elm[this.DOMProperty] = value;

};

InputDateBinder.prototype.ui2Model = function() {
    var value = dtUtils.fromDOMDateTime(this.elm[this.DOMProperty]);
    this.object[this.name] = new Date(this.elm[this.DOMProperty]);
};


