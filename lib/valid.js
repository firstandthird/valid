(function($){

  $.declare('valid', {
    defaults: {
      errorClass: 'valid-input-error',
      validClass: 'valid-input-valid',
      inputTypes: ['input', 'textarea', 'select'],
      validateOnBlur: true,
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

      if (this.validateOnBlur){
        this.bindEvents();
      }
    },

    bindEvents: function() {
      var inputs = this.find(this.inputTypes.join());

      inputs.unbind(this.supportedInputEvent + ' blur.valid');
      inputs.bind(this.supportedInputEvent + ' blur.valid', this.proxy(this.check));
    },

    check: function(e) {
      if(this.preventDefault && e) {
        e.preventDefault();
      }

      var self = this;
      this.results = [];

      this.find(this.inputTypes.join()).each(function() {
        var $this = $(this);

        var isActiveEl = e && $this.is(e.target),
          isSubmit = e && e.type === 'submit';

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

                if(!isSubmit) {
                  if(isActiveEl) {
                    self.emit('inputFailing', [response.element, response]);
                  } 
                } else {
                  self.emit('inputInvalid', [response.element, response]);
                  $this.addClass(self.errorClass).removeClass(self.validClass);
                }
              } else {
                if(!isSubmit) {
                  if(isActiveEl) {
                    self.emit('inputPassing', [response.element, response]);
                  }
                } else {
                  self.emit('inputValid', [response.element]);
                  $this.addClass(self.validClass).removeClass(self.errorClass);
                }
              }
            }
          }
        });
      });

      if(this.results.length) {
        this.emit('formInvalid', [this.el, this.results]);

        if (!e){
          return this.results;
        }
      } else {
        this.emit('formValid', [this.el]);

        if (!e){
          return true;
        }
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
    },

    maxLength: function(input) {
      return this.validate(input, 'maxLength', input.data('valid-max-length'));
    }
  });
}(jQuery));
