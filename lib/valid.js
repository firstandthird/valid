(function($){
  var valid = function(form, customValidators) {
    var validator;
    var validators = {};

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

        if(!validators[validator] && !valid[validator]) {
          validators[validator] = customValidators[validator];
          valid[validator] = customValidators[validator];
        }
      }

      new validations(validators);
    }

    this.bindEvents();

    return this;
  };

  valid.prototype.check = function() {
    var self = this;
    var passes = false;

    this.form.find(this.inputTypes.join()).each(function() {
      var $this = $(this);

      $.each(this.attributes, function(i, attr) {
        var method = '';

        if(attr.name.indexOf('data-valid-') === 0 || attr.name === 'required') {
          method = $.camelCase(attr.name.replace('data-valid-', ''));
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
    this.form.unbind('submit');

    inputs.bind(this.supportedInputEvent + ' blur.valid', function(event) {
      var $this = $(this);

      $.each($this[0].attributes, function(i, attr) {
        var method = '';

        if(attr.name.indexOf('data-valid-') === 0 || attr.name === 'required') {
          method = $.camelCase(attr.name.replace('data-valid-', ''));
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

    this.form.on('submit', function(event) {
      var response = self.check();

      if(response === true) {
        return true;
      }

      return false;
    });
  };

  valid.validate = function(input, type) {
    var text = "";
    var target;

    if(typeof input === 'object') {
      text = input.val();
      target = input.data('valid-validate');

      if(target && target.length > 0) {
        pattern = target;
      }
    } else {
      text = input;
    }

    var args = $.makeArray(arguments);

    args[0] = text;
    args.splice(1, 1);

    if(typeof validations[type] === 'undefined') return false;

    return validations[type].apply(this, args);
  };

  valid.custom = function(input, pattern) {
    return valid.validate(input, 'validate', pattern);
  };

  valid.required = function(input) {
    return valid.validate(input, 'required');
  };

  valid.email = function(input) {
    return valid.validate(input, 'email');
  };

  valid.password = function(input, method) {
    return valid.validate(input, 'password', method);
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

    return valid.validate(input, 'passwordConfirm', confirm);
  };

  window.valid = valid;
}(jQuery));