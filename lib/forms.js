/*
 * forms
 * https://github.com/parroit/forms
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var dtUtils = require('./dt-utils');
var binderChooser = require('./binder-chooser');

function domVisitor(elm, fn, ctx) {
    if (elm) {
        if (fn.call(ctx, elm)) {
            var i = 0;
            var l = elm.childNodes.length;

            for (; i < l; i++) {
                domVisitor(elm.childNodes[i], fn, ctx);
            }
        }

    }
}

function maybeBind(elm) {
    //jshint validthis:true
    var bind;
    var ids = [
        (elm.id && elm.id.toLowerCase()) || '',
        (elm.getAttribute && (bind = elm.getAttribute('data-bind')) && bind.toLowerCase()) || '',
        (elm.name && elm.name.toLowerCase()) || ''
    ];

    var i = 0;
    var l = ids.length;
    var prop;
    var results = this.results;

    function addBindElement(name) {
        if (name in results) {
            results[name].push(elm);
        } else {
            results[name] = [elm];
        }
        return false;
    }

    for (; i < l; i++) {
        var id = ids[i];
        var idx = this.props.indexOf(id);

        if (idx !== -1) {
            return addBindElement(this.props[idx]);
        }
    }

    i = 0;
    l = this.props.length;

    for (; i < l; i++) {
        prop = this.props[i];
        if (elm.className) {
            var classes = elm.className.split(' ').map(''.toLowerCase.call.bind(''.toLowerCase));
            if (classes.indexOf(prop) !== -1) {
                return addBindElement(prop);
            }
        }

    }

    return true;
}


function bindObject(element, object) {
    var ctx = {
        props: Object.keys(object),
        results: {}
    };

    domVisitor(element, maybeBind, ctx);

    //console.dir(ctx);

    var i = 0;
    var bindedProps = Object.keys(ctx.results);
    var l = bindedProps.length;

    function bindIt(bindedProp) {
        return function (elm) {
            bindProperty(elm, object, bindedProp);
        };
    }


    for (; i < l; i++) {
        var bindedProp = bindedProps[i];
        var bindElms = ctx.results[bindedProp];
        bindElms.forEach(bindIt(bindedProp));
    }

}

function bindProperty(element, object, name) {
    var Binder = binderChooser(element, object, name);
    var binder = new Binder(element, object, name);
    binder.bind();
    binder.model2Ui();
}

module.exports = {
    bindProperty: bindProperty,
    bindObject: bindObject
};
