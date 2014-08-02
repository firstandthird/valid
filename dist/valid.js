
/*!
 * valid - Javascript library to validate input fields in a form
 * v0.3.0
 * https://github.com/firstandthird/valid
 * copyright First + Third 2014
 * MIT License
*/
/*!
 * validations - Utility lib to do string validations
 * v0.0.4
 * https://github.com/firstandthird/validations
 * copyright First + Third 2014
 * MIT License
*/
(function(){
  var root = this;

  var alphaSize = function(text) {
    var count = 0;
    var lower, upper, number, symbol, symbol2;
    lower = upper = number = symbol = symbol2 = false;
    var other = '';
    var i, c;

    for(i = 0, c = text.length; i < c; i++) {
      if(!lower && /[a-z]/.test(text)) {
        count += 26;
        lower = true;
      } else if(!upper && /[A-Z]/.test(text)) {
        count += 26;
        upper = true;
      } else if(!number && /\d/.test(text)) {
        count += 10;
        number = true;
      } else if(!symbol && '!@#$%^&*()'.indexOf(text) > -1) {
        count += 10;
        symbol = true;
      } else if(!symbol2 && '~`-_=+[]{}\\|;:\'",.<>?/'.indexOf(text) > -1) {
        count += 22;
        symbol2 = true;
      } else if(other.indexOf(text) === -1) {
        count++;
        other += text;
      }
    }

    return count;
  };

  var validations = function(customValidators) {
    var validator;

    if(typeof customValidators === 'object') {
      for(validator in customValidators) {
        if(!validations[validator]) {
          validations[validator] = customValidators[validator];
        }
      }
    }

    return this;
  };

  validations.validate = function(input, pattern, type) {
    var result = {
      valid: false,
      type: type || 'validate'
    };

    if(pattern instanceof RegExp) {
      result.valid = pattern.test(input);
    } else if(typeof pattern === 'string') {
      result.valid = pattern === input;
    } else if(typeof pattern === 'function') {
      result.valid = pattern(input);
    }

    return result;
  };

  validations.required = function(input) {
    return validations.validate(input, function(text) {
      return text.length > 0;
    }, 'required');
  };

  validations.email = function(input) {
    return validations.validate(input.toLowerCase(), /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/, 'email');
  };

  validations.password = function(input, method) {
    method = method || function(text) {
      return text.length > 5;
    };

    return validations.validate(input, method, 'password');
  };

  validations.passwordConfirm = function(input, confirm) {
    return validations.validate(input, confirm, 'password-confirm');
  };

  validations.passwordStrength = function(password, secureThreshold) {
    if(!password.length) return 0;

    // Sets default threshold to NIST (SP 800-63) recommended 80bit.
    secureThreshold = secureThreshold || 80;

    var entropy = (password.length * Math.log(alphaSize(password))) / Math.log(2);
    var bits = Math.round(entropy * 100) / 100;

    if(bits > secureThreshold) bits = secureThreshold;

    return ~~((bits / secureThreshold) * 100);
  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = validations;
    }
    exports.validations = validations;
  } else {
    root.validations = validations;
  }


}());

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
    }
  });
}(jQuery));
