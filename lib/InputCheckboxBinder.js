/*
 * forms
 * https://github.com/parroit/forms
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var dtUtils  = require('./dt-utils');

module.exports = InputCheckboxBinder;

var InputBinder = require('./InputBinder');

function InputCheckboxBinder(elm, object, name) {
    InputBinder.call(this, elm, object, name);

}

InputCheckboxBinder.prototype = Object.create(InputBinder.prototype);

InputCheckboxBinder.prototype.model2Ui = function() {
    if (this.elm.checked !== this.object[this.name]) {
        this.elm.checked = this.object[this.name];
    }


};

InputCheckboxBinder.prototype.ui2Model = function() {
    if (this.object[this.name] !== this.elm.checked) {
        this.object[this.name] = this.elm.checked;
    }

};


