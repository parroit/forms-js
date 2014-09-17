# forms.js 

##Javascript two-way html binding template engine

* work on node server and on browser
* two-way data binding on the browser
* DOM based template



[![Build Status](https://secure.travis-ci.org/parroit/forms-js.png?branch=master)](http://travis-ci.org/parroit/forms-js) [![NPM version](https://badge-me.herokuapp.com/api/npm/forms.js.png)](http://badges.enytc.com/for/npm/forms.js) 

## Getting Started
Install the module with: `npm install forms.js`

```javascript

var forms = require('forms.js');
var credential = {
    username: '',
    password: ''
};
// bind credential object to a DOM element form
forms.bind(document.getElementById('login-form'),credential); 

```

## Other stuff

* documentation - maybe I will add documentation if you ask it. open an issue for this.
* support - open an issue [here](https://github.com/parroit/forms-js/issues).

## License
[MIT](http://opensource.org/licenses/MIT) © 2014, Andrea Parodi