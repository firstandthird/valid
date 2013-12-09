(function($){
  var valid = function(form, customValidators) {
    var validator;

    this.inputTypes = ['input', 'textarea'];
    this.form = form;
    this.results = [];

    if(typeof customValidators === 'object') {
      for(validator in customValidators) {
        if(validator === 'inputTypes') {
          this.inputTypes = customValidators[validator];
          continue;
        }

        if(!valid[validator]) {
          valid[validator] = customValidators[validator];
        }
      }
    }

  };

  valid.prototype.check = function() {
    var self = this;
    var passes = false;

    this.form.find(this.inputTypes.join()).each(function() {
      var $this = $(this);

      $.each(this.attributes, function(i, attr) {
        var method = '';

        if(attr.name.indexOf('data-valid-') === 0 || attr.name === 'required') {
          var method = $.camelCase(attr.name.replace('data-valid-', ''));
          var response;

          if(valid[method]) {
            response = valid[method]($this);

            if(!response.valid) {
              response.element = $this[0];
              self.results.push(response);

              self.form.trigger('invalid', [response.element, response]);
            }
          }
        }
      });
    });

    passes = this.results.length ? this.results : true;

    if(passes) {
      this.form.trigger('valid');
    }

    return passes;
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