(function (name, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        this[name] = factory();
    }
}('forms', function (define) {
    function _require(index) {
        var module = _require.cache[index];
        if (!module) {
            var exports = {};
            module = _require.cache[index] = {
                id: index,
                exports: exports
            };
            _require.modules[index].call(exports, module, exports);
        }
        return module.exports;
    }
    _require.cache = [];
    _require.modules = [
        function (module, exports) {
            'use strict';
            var dtUtils = _require(7);
            module.exports = ElementBinder;
            function ElementBinder(elm, object, name) {
                this.elm = elm;
                this.name = name;
                this.object = object;
                this.DOMProperty = 'innerHTML';
                this.onChanges = onChanges.bind(this);
            }
            function onChanges(changes) {
                console.dir(changes);
                var _this = this;
                changes.forEach(function (change) {
                    if (change.name === _this.name) {
                        _this.model2Ui();
                    }
                });
            }
            ElementBinder.prototype.bind = function () {
                Object.observe(this.object, this.onChanges);
            };
            ElementBinder.prototype.unbind = function () {
                Object.unobserve(this.object, this.onChanges);
            };
            ElementBinder.prototype.model2Ui = function () {
                var value = this.object[this.name];
                if (dtUtils.isDate(value) || dtUtils.isNumber(value)) {
                    value = value.toLocaleString();
                }
                if (this.elm[this.DOMProperty] !== value) {
                    this.elm[this.DOMProperty] = value;
                }
            };
            ElementBinder.prototype.ui2Model = function () {
                if (this.object[this.name] !== this.elm[this.DOMProperty]) {
                    this.object[this.name] = this.elm[this.DOMProperty];
                }
            };
        },
        function (module, exports) {
            'use strict';
            module.exports = InputBinder;
            var ElementBinder = _require(0);
            function InputBinder(elm, object, name) {
                ElementBinder.call(this, elm, object, name);
                this.DOMProperty = 'value';
                this.onInput = this.ui2Model.bind(this);
            }
            InputBinder.prototype = Object.create(ElementBinder.prototype);
            InputBinder.prototype.bind = function () {
                this.elm.addEventListener('input', this.onInput);
                ElementBinder.prototype.bind.call(this);
            };
            InputBinder.prototype.unbind = function () {
                this.elm.removeEventListener('input', this.onInput);
                ElementBinder.prototype.unbind.call(this);
            };
        },
        function (module, exports) {
            'use strict';
            var dtUtils = _require(7);
            module.exports = InputCheckboxBinder;
            var InputBinder = _require(1);
            function InputCheckboxBinder(elm, object, name) {
                InputBinder.call(this, elm, object, name);
            }
            InputCheckboxBinder.prototype = Object.create(InputBinder.prototype);
            InputCheckboxBinder.prototype.model2Ui = function () {
                if (this.elm.checked !== this.object[this.name]) {
                    this.elm.checked = this.object[this.name];
                }
            };
            InputCheckboxBinder.prototype.ui2Model = function () {
                if (this.object[this.name] !== this.elm.checked) {
                    this.object[this.name] = this.elm.checked;
                }
            };
        },
        function (module, exports) {
            'use strict';
            var dtUtils = _require(7);
            module.exports = InputDateBinder;
            var InputBinder = _require(1);
            function InputDateBinder(elm, object, name) {
                InputBinder.call(this, elm, object, name);
            }
            InputDateBinder.prototype = Object.create(InputBinder.prototype);
            InputDateBinder.prototype.model2Ui = function () {
                var value = dtUtils.toDOMDate(this.object[this.name]);
                if (this.elm[this.DOMProperty] !== value) {
                    this.elm[this.DOMProperty] = value;
                }
            };
            InputDateBinder.prototype.ui2Model = function () {
                var value = dtUtils.fromDOMDate(this.elm[this.DOMProperty]);
                if (this.object[this.name] !== value) {
                    this.object[this.name] = value;
                }
            };
        },
        function (module, exports) {
            'use strict';
            var dtUtils = _require(7);
            module.exports = InputNumberBinder;
            var InputBinder = _require(1);
            function InputNumberBinder(elm, object, name) {
                InputBinder.call(this, elm, object, name);
            }
            InputNumberBinder.prototype = Object.create(InputBinder.prototype);
            InputNumberBinder.prototype.model2Ui = function () {
                var value = this.object[this.name];
                if (value === 0 || value) {
                    value = value.toString();
                }
                if (this.elm[this.DOMProperty] !== value) {
                    this.elm[this.DOMProperty] = value;
                }
            };
            InputNumberBinder.prototype.ui2Model = function () {
                var value = parseFloat(this.elm[this.DOMProperty]);
                if (this.object[this.name] !== value) {
                    this.object[this.name] = value;
                }
            };
        },
        function (module, exports) {
            'use strict';
            var dtUtils = _require(7);
            module.exports = InputRadioBinder;
            var InputBinder = _require(1);
            function InputRadioBinder(elm, object, name) {
                InputBinder.call(this, elm, object, name);
                this.value = this.elm.getAttribute('value');
            }
            InputRadioBinder.prototype = Object.create(InputBinder.prototype);
            InputRadioBinder.prototype.model2Ui = function () {
                var value = this.object[this.name] == this.value;
                if (this.elm.checked !== value) {
                    this.elm.checked = value;
                }
            };
            InputRadioBinder.prototype.bind = function () {
                this.elm.addEventListener('change', this.onInput);
                InputBinder.prototype.bind.call(this);
            };
            InputRadioBinder.prototype.ui2Model = function () {
                if (this.elm.checked && this.object[this.name] !== this.value) {
                    this.object[this.name] = this.value;
                }
            };
        },
        function (module, exports) {
            'use strict';
            var ElementBinder = _require(0);
            var InputBinder = _require(1);
            var InputCheckboxBinder = _require(2);
            var InputDateBinder = _require(3);
            var InputNumberBinder = _require(4);
            var InputRadioBinder = _require(5);
            var inputTags = [
                    'input',
                    'select',
                    'textarea'
                ];
            module.exports = function (elm, object, name) {
                var elmTag = elm.tagName.toLowerCase();
                if (inputTags.indexOf(elmTag) !== -1) {
                    var type = elm.getAttribute('type');
                    switch (type) {
                    case 'date':
                        return InputDateBinder;
                    case 'checkbox':
                        return InputCheckboxBinder;
                    case 'number':
                        return InputNumberBinder;
                    case 'radio':
                        return InputRadioBinder;
                    default:
                        return InputBinder;
                    }
                }
                return ElementBinder;
            };
        },
        function (module, exports) {
            'use strict';
            module.exports = function forms() {
            };
            function fromDOMDate(value) {
                var dt = new Date();
                dt.setUTCFullYear(parseInt(value.slice(0, 4)));
                dt.setUTCMonth(parseInt(value.slice(5, 7)) - 1);
                dt.setUTCDate(parseInt(value.slice(8, 10)));
                dt.setUTCHours(0);
                dt.setUTCMinutes(0);
                dt.setUTCSeconds(0);
                dt.setUTCMilliseconds(0);
                return dt;
            }
            function fromDOMDateTime(value) {
                var dt = new Date();
                dt.setUTCFullYear(parseInt(value.slice(0, 4)));
                dt.setUTCMonth(parseInt(value.slice(5, 7)) - 1);
                dt.setUTCDate(parseInt(value.slice(8, 10)));
                dt.setUTCHours(parseInt(value.slice(11, 13)));
                dt.setUTCMinutes(parseInt(value.slice(14, 16)));
                dt.setUTCSeconds(parseInt(value.slice(17, 19)));
                dt.setUTCMilliseconds(0);
                return dt;
            }
            function pad2(num) {
                if (num < 10) {
                    return '0' + num;
                }
                return num;
            }
            function toDOMDate(value) {
                var y = value.getFullYear();
                var m = pad2(value.getMonth() + 1);
                var d = pad2(value.getDate());
                return [
                    y,
                    m,
                    d
                ].join('-');
            }
            function toDOMTime(value) {
                var h = pad2(value.getHours());
                var m = pad2(value.getMinutes());
                var s = pad2(value.getSeconds());
                return [
                    h,
                    m,
                    s
                ].join(':');
            }
            function isDate(value) {
                return typeof value === 'object' && {}.toString.call(value) === '[object Date]';
            }
            function isNumber(value) {
                return typeof value === 'number' || typeof value === 'object' && {}.toString.call(value) === '[object Number]';
            }
            function toIsoString(dtValue) {
                var tz = dtValue.getTimezoneOffset();
                var value = toDOMDate(dtValue) + 'T' + toDOMTime(dtValue) + (tz > 0 ? '-' : '+') + pad2(Math.abs(Math.floor(tz / 60))) + ':' + pad2(Math.abs(tz % 60));
                return value;
            }
            module.exports = {
                toDOMTime: toDOMTime,
                toDOMDate: toDOMDate,
                fromDOMDate: fromDOMDate,
                fromDOMDateTime: fromDOMDateTime,
                isDate: isDate,
                isNumber: isNumber,
                pad2: pad2,
                toIsoString: toIsoString
            };
        },
        function (module, exports) {
            'use strict';
            var dtUtils = _require(7);
            var binderChooser = _require(6);
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
                var bind;
                var ids = [
                        elm.id && elm.id.toLowerCase() || '',
                        elm.getAttribute && (bind = elm.getAttribute('data-bind')) && bind.toLowerCase() || '',
                        elm.name && elm.name.toLowerCase() || ''
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
                function itemsSpliced(change) {
                    var i = change.index;
                    var l = change.index + change.removed.length;
                    for (; i < l; i++) {
                        var removingElm = bindedChildren[i];
                        parent.removeChild(removingElm);
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
                    parent.removeChild(elm);
                    bindedChildren[change.name] = newElm;
                    bindObject(newElm, array[change.name]);
                }
                function itemDeleted(change) {
                    var elmRemoved = bindedChildren[change.name];
                    parent.removeChild(elmRemoved);
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
                Array.observe(array, function (changes) {
                    changes.forEach(onArrayChange);
                });
            }
            function bindProperty(element, object, name) {
                var value = object[name];
                if (typeof value === 'object' && !dtUtils.isDate(value) && !Array.isArray(value)) {
                    return bindObject(element, value);
                }
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
        }
    ];
    return _require(8);
}));