(function($){
  var valid = function(form, customValidators) {
    var validator;

    this.inputTypes = ['input', 'textarea'];
    this.form = form;
    this.results = [];

    //Detects if html5 events are supported.
    this.supportedInputEvent = (('oninput' in document.createElement('input')) ? 'input' : 'keyup') + '.valid';

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

    this.bindEvents();

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

  valid.prototype.bindEvents = function() {
    var self = this;
    var inputs = this.form.find(this.inputTypes.join());

    inputs.unbind(this.supportedInputEvent + ' blur.valid');

    inputs.bind(this.supportedInputEvent + ' blur.valid', function(event) {
      var $this = $(this);

      $.each($this[0].attributes, function(i, attr) {
        var method = '';

        if(attr.name.indexOf('data-valid-') === 0 || attr.name === 'required') {
          var method = $.camelCase(attr.name.replace('data-valid-', ''));
          var response;

          if(valid[method]) {
            response = valid[method]($this);
            response.element = $this[0];

            if(!response.valid) {
              if(event.type === 'blur') {
                self.form.trigger('fail', [$this, response]);
              } else {
                self.form.trigger('failing', [$this, response]);
              }
            } else {
              if(event.type === 'blur') {
                self.form.trigger('pass', [$this, response]);
              } else {
                self.form.trigger('passing', [$this, response]);
              }
            }
          }
        }
      });
    });
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
    var target;

    if(typeof input === 'object') {
      target = input.data('valid-password-confirm');
      if(target && target.length > 0) {
        confirm = $('#' + target);
      }
    }

    if(typeof confirm === 'object') {
      confirm = confirm.val();
    }

    return valid.validate(input, confirm, 'password-confirm');
  };

  window.valid = valid;
}(jQuery));