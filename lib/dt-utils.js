/*
 * forms
 * https://github.com/parroit/forms
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function forms() {};

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
    //console.log(value)
    var y = value.getFullYear();
    var m = pad2(value.getMonth() + 1);
    var d = pad2(value.getDate());

    return [y, m, d].join('-');

}

/**
 *      format a date as %H:%M
 */
function toDOMTime(value) {
    var h = pad2(value.getHours());
    var m = pad2(value.getMinutes());

    return [h, m].join(':');

}

module.exports = {
    toDOMTime: toDOMTime,
    toDOMDate: toDOMDate,
    fromDOMDate: fromDOMDate
};
