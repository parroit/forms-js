/*
 * forms
 * https://github.com/parroit/forms
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

module.exports = InputBinder;

var ElementBinder = require('./ElementBinder');

function InputBinder(elm, object, name) {
    ElementBinder.call(this, elm, object, name);
    this.DOMProperty = 'value';
    this.onInput = this.ui2Model.bind(this);
}

InputBinder.prototype = Object.create(ElementBinder.prototype);

InputBinder.prototype.bind = function() {
    this.elm.addEventListener('input', this.onInput);
    
    ElementBinder.prototype.bind.call(this);
};

InputBinder.prototype.unbind = function() {
    this.elm.removeEventListener('input', this.onInput);
    ElementBinder.prototype.unbind.call(this);
};


