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
        (elm.id && elm.id.toLowerCase()) || '', (elm.getAttribute && (bind = elm.getAttribute('data-bind')) && bind.toLowerCase()) || '', (elm.name && elm.name.toLowerCase()) || ''
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
        props: [],
        results: {}
    };

    for (var prop in object) {
        ctx.props.push(prop);
    }

    domVisitor(element, maybeBind, ctx);

    var i = 0;
    var bindedProps = Object.keys(ctx.results);
    var l = bindedProps.length;

    function bindIt(bindedProp) {
        return function(elm) {
            bindProperty(elm, object, bindedProp);
        };
    }

    for (; i < l; i++) {
        var bindedProp = bindedProps[i];
        var bindElms = ctx.results[bindedProp];
        bindElms.forEach(bindIt(bindedProp));
    }

}

function bindArray(element, array) {
    var parent = element.parentNode;
    var bindedChildren = [];

    function startingBind() {
        var i = 1;
        var l = array.length;


        for (; i < l; i++) {
            var cloned = element.cloneNode(true);
            parent.appendChild(cloned);
            bindObject(cloned, array[i]);

            bindedChildren[i] = cloned;

        }

        if (l > 0) {
            element.style.display = null;
            bindObject(element, array[0]);
            bindedChildren[0] = element;
        } else {
            element.style.display = 'none';
        }
    }

    function removeItemElement(removingElm) {
        if (bindedChildren.length > 1) {
            parent.removeChild(removingElm);
        } else {
            element = removingElm;
            removingElm.style.display = 'none';
        }
    }

    function itemsSpliced(change) {
        var i = change.index;
        var l = change.index + change.removed.length;
        for (; i < l; i++) {
            removeItemElement(bindedChildren[i]);
        }

        bindedChildren.splice(change.index, change.removed.length);

        i = 0;
        l = change.addedCount;
        for (; i < l; i++) {
            var cloned = element.cloneNode(true);
            parent.appendChild(cloned);
            bindedChildren[change.index + i] = cloned;
            bindObject(cloned, array[change.index + i]);
        }
    }

    function itemUpdated(change) {
        var elm = bindedChildren[change.name];

        var newElm = element.cloneNode(true);
        parent.insertBefore(newElm, elm);
        removeItemElement(elm);

        bindedChildren[change.name] = newElm;
        bindObject(newElm, array[change.name]);
    }

    function itemDeleted(change) {
        var elmRemoved = bindedChildren[change.name];
        removeItemElement(elmRemoved);
        delete bindedChildren[change.name];
    }

    function onArrayChange(change) {

        if (change.type === 'splice') {
            return itemsSpliced(change);
        }

        if (change.type === 'updated') {
            return itemUpdated(change);
        }

        if (change.type === 'deleted') {
            return itemDeleted(change);
        }

        console.dir(change);
    }

    startingBind();

    Array.observe(array, function(changes) {
        changes.forEach(onArrayChange);
    });

}

function bindProperty(element, object, name) {
    var value = object[name];

    if (typeof value === 'object' &&
        !dtUtils.isDate(value) &&
        !Array.isArray(value)
    ) {

        return bindObject(element, value);
    }

    //console.log('%s -> %s',name,Array.isArray(value));
    if (Array.isArray(value)) {

        return bindArray(element, value);
    }

    var Binder = binderChooser(element, object, name);
    var binder = new Binder(element, object, name);
    binder.bind();
    binder.model2Ui();
}

module.exports = {
    bindProperty: bindProperty,
    bindObject: bindObject
};
