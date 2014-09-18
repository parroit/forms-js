/*
 * forms
 * https://github.com/parroit/forms
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

module.exports = {
    later: function(fn, done) {
        setTimeout(function() {
            try {
                fn();
                done();
            } catch (err) {
                done(err);
            }
        }, 0);

    }
};
