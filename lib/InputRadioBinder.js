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
    this.value = this.elm.getAttribute('value');
}

InputRadioBinder.prototype = Object.create(InputBinder.prototype);

InputRadioBinder.prototype.model2Ui = function() {
    this.elm.checked = this.object[this.name] == this.value;

};

InputRadioBinder.prototype.ui2Model = function() {
    if (this.elm.checked) {
        this.object[this.name] = this.value;    
    }
    
};


