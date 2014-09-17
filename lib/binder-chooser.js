/*
 * forms
 * https://github.com/parroit/forms
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var ElementBinder = require('./ElementBinder');
var InputBinder = require('./InputBinder');
var InputCheckboxBinder = require('./InputCheckboxBinder');
var InputDateBinder = require('./InputDateBinder');
var InputNumberBinder = require('./InputNumberBinder');
var inputTags = ['input', 'select', 'textarea'];

module.exports = function(elm, object, name){
    var elmTag = elm.tagName.toLowerCase();

    if (inputTags.indexOf(elmTag) !== -1) {
        var type = elm.getAttribute('type');
        switch (type){
            case 'date':
                return InputDateBinder;
            case 'checkbox':
                return InputCheckboxBinder;
            case 'number':
                return InputNumberBinder;
            default:
                return InputBinder;
        }

    }

    return ElementBinder;

};
