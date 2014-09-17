/*
 * forms
 * https://github.com/parroit/forms
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

module.exports = ElementBinder;


function ElementBinder(elm, object, name) {
    this.elm = elm;
    this.name = name;
    this.object = object;
    this.DOMProperty = 'innerHTML';
    this.onChanges = onChanges.bind(this);
}

function onChanges(changes) {
    //jshint validthis:true
    var _this = this;
    changes.forEach(function(change) {
        if (change.name === _this.name) {
            _this.model2Ui();
        }
    });
}

ElementBinder.prototype.bind = function() {

    Object.observe(this.object, this.onChanges);
};

ElementBinder.prototype.unbind = function() {
    Object.unobserve(this.object, this.onChanges);
};

ElementBinder.prototype.model2Ui = function() {
    this.elm[this.DOMProperty] = this.object[this.name];
};

ElementBinder.prototype.ui2Model = function() {
    this.object[this.name] = this.elm[this.DOMProperty];
};
