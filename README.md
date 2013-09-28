#valid

Javascript library to validate input fields in a form

##Installation

###Bower

`bower install valid`

###Manual Download

- [Development]()
- [Production]()

##Usage

HTML:
```html
<form>
	<label>Name: </label><input name="name" type="text" data-required />
	<label>Email: </label><input type="text" data-regex="[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}" name="email" />
</form>
```

JS:
```javascript
var errors = valid($('form'));

if (!errors) {
	console.log('no errors');
} else {
	console.log(errors);
	// [{ type: 'required', el: <input>, error: 'required' }, { type: 'regex', el: <input>, error: 'invalid' }]
}

```


##Development

###Requirements

- node and npm
- bower `npm install -g bower`
- grunt `npm install -g grunt-cli`

###Setup

- `npm install`
- `bower install`

###Run

`grunt dev`

or for just running tests on file changes:

`grunt ci`

###Tests

`grunt mocha`
