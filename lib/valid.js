(function($){
  var valid = function(form, customValidators) {
    var validator;

    this.form = form;

    if(typeof customValidators === 'object') {
      for(validator in customValidators) {
        if(!valid[validator]) {
          valid[validator] = customValidators[validator];
        }
      }
    }
  };

  valid.prototype.check = function() {
    
  };

  valid.validate = function(input, pattern, type) {
    var text = "";
    var result = {
      valid: false,
      type: type || 'validate'
    };

    if(typeof input === 'object') {
      text = input.val();
    } else {
      text = input;
    }

    if(pattern instanceof RegExp) {
      result.valid = pattern.test(text);
    } else if(typeof pattern === 'string') {
      result.valid = pattern === text;
    } else if(typeof pattern === 'function') {
      result.valid = pattern(text);
    }

    return result;
  };

  valid.required = function(input) {
    return valid.validate(input, function(text) {
      return text.length > 0;
    }, 'required');
  };

  valid.email = function(input) {
    return valid.validate(input, /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/, 'email');
  };

  valid.password = function(input, method) {
    method = method || function(text) {
      return text.length > 5;
    };

    return valid.validate(input, method, 'password');
  };

  valid.passwordConfirm = function(input, confirm) {
    if(typeof confirm === 'object') {
      confirm = confirm.val();
    }

    return valid.validate(input, confirm, 'password-confirm');
  };

  window.valid = valid;
}(jQuery));