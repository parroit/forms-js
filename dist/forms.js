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
                this.elm[this.DOMProperty] = this.object[this.name];
            };
            ElementBinder.prototype.ui2Model = function () {
                this.object[this.name] = this.elm[this.DOMProperty];
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
                this.elm.checked = this.object[this.name];
            };
            InputCheckboxBinder.prototype.ui2Model = function () {
                this.object[this.name] = this.elm.checked;
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
                this.elm[this.DOMProperty] = value;
            };
            InputDateBinder.prototype.ui2Model = function () {
                var value = dtUtils.fromDOMDate(this.elm[this.DOMProperty]);
                this.object[this.name] = value;
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
                this.elm[this.DOMProperty] = value;
            };
            InputNumberBinder.prototype.ui2Model = function () {
                var value = parseFloat(this.elm[this.DOMProperty]);
                this.object[this.name] = value;
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
                this.elm.checked = this.object[this.name] == this.value;
            };
            InputRadioBinder.prototype.bind = function () {
                this.elm.addEventListener('change', this.onInput);
                InputBinder.prototype.bind.call(this);
            };
            InputRadioBinder.prototype.ui2Model = function () {
                if (this.elm.checked) {
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
                return [
                    h,
                    m
                ].join(':');
            }
            module.exports = {
                toDOMTime: toDOMTime,
                toDOMDate: toDOMDate,
                fromDOMDate: fromDOMDate
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
                        props: Object.keys(object),
                        results: {}
                    };
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
        }
    ];
    return _require(8);
}));