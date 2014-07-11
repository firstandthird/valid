(function($){

  $.declare('valid', {
    defaults: {
      errorClass: 'valid-input-error',
      validClass: 'valid-input-valid',
      inputTypes: ['input', 'textarea', 'select'],
      preventDefault: true
    },
    events: {
      'submit': 'check'
    },
    init: function() {
      var validator;
      var validators = {};
      this.results = [];

      //Detects if html5 events are supported.
      this.supportedInputEvent = (('oninput' in document.createElement('input')) ? 'input' : 'keyup') + '.valid';

      if(typeof this.customValidators === 'object') {
        for(validator in this.customValidators) {
          if(validator === 'inputTypes') {
            this.inputTypes = this.customValidators[validator];
            continue;
          }

          if(!validators[validator] && !this[validator]) {
            validators[validator] = this.customValidators[validator];
            this[validator] = this.customValidators[validator];
          }
        }

        new validations(validators);
      }

      this.bindEvents();
    },

    bindEvents: function() {
      var self = this;
      var inputs = this.find(this.inputTypes.join());

      inputs.unbind(this.supportedInputEvent + ' blur.valid');

      inputs.bind(this.supportedInputEvent + ' blur.valid', function(event) {
        var $this = $(this);

        $.each($this[0].attributes, function(i, attr) {
          var method = '';

          if(attr.name.indexOf('data-valid-') === 0 || attr.name === 'required') {
            method = $.camelCase(attr.name.replace('data-valid-', ''));
            var response;

            if(self[method]) {
              response = self[method].call(self, $this);
              response.element = $this[0];

              if(!response.valid) {
                if(event.type === 'blur') {
                  self.emit('inputFail', [$this, response]);
                } else {
                  self.emit('inputFailing', [$this, response]);
                }
              } else {
                if(event.type === 'blur') {
                  self.emit('inputPass', [$this, response]);
                } else {
                  self.emit('inputPassing', [$this, response]);
                }
              }
            }
          }
        });
      });
    },

    check: function(e) {
      if(this.preventDefault) {
        e.preventDefault();
      }

      var self = this;
      var passes = false;
      this.results = [];

      this.find(this.inputTypes.join()).each(function() {
        var $this = $(this);

        $.each(this.attributes, function(i, attr) {
          var method = '';

          if(attr.name.indexOf('data-valid-') === 0 || attr.name === 'data-valid-required') {
            method = $.camelCase(attr.name.replace('data-valid-', ''));
            var response;

            if(self[method]) {
              response = self[method].call(self, $this);
              response.element = $this[0];

              if(!response.valid) {
                self.results.push(response);
                self.emit('inputInvalid', [response.element, response]);
                $this.addClass(self.errorClass).removeClass(self.validClass);
              } else {
                self.emit('inputValid', [response.element]);
                $this.addClass(self.validClass).removeClass(self.errorClass);
              }
            }
          }
        });
      });

      passes = this.results.length ? this.results : true;

      if(passes) {
        this.emit('formValid', [this.el, this.results]);
      } else {
        this.emit('formInvalid', [this.el]);
      }
    },

    validate: function(input, type) {
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
    },

    custom: function(input, pattern) {
      return this.validate(input, 'validate', pattern);
    },

    required: function(input) {
      return this.validate(input, 'required');
    },

    email: function(input) {
      return this.validate(input, 'email');
    },

    password: function(input, method) {
      return this.validate(input, 'password', method);
    },

    passwordConfirm: function(input, confirm) {
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

      return this.validate(input, 'passwordConfirm', confirm);
    }
  });
}(jQuery));