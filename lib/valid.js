var valid = function(el) {
  // jquery the selector
  var $el = $(el);
  // narrow selection to only these validations
  var $els = $el.find('[data-valid-required], [data-valid-pattern], [data-valid-email]');
  // storage array to return
  var arr = [];

  // tests the pattern against the value that is passed
  // in, returns true if there is a match
  var testPattern = function( value, pattern ) {
      var regex = new RegExp(pattern);
      return regex.test(value);
  };

  // check for errors
  var getError = function(element) {
    // jquery the selector
    var $element = $(element);
    // trim the whitespace on inputs
    var $value = $.trim($element.val());
    // set the default error
    var error = false;
    var type = 'required';
    var pattern;

    // test the regex pattern
    if ($element.data('valid-pattern')) {
      type = 'pattern';
      pattern = $element.data('valid-pattern');
      // test() will return true for a match
      // want to reverse that so it reads like english
      // i.e. if there is an error, set error to true
      error = ! testPattern($element.val(), pattern);
    }
    // test the email pattern
    if ($element.data('valid-email') === '') {
        type = 'email';
        pattern = /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        //run the pattern check with this pattern
        // needs to return true if there is an error
        error = ! testPattern($element.val(), pattern);
    }

    // this will check for an empty value
    // covers the required case
    if ($value.length === 0) {
      error = true;
    }

    if (!error) {
      return false;
    }

    return {
      'element' : $element[0],
      'type' : type
    };
  };

  $.each($els, function() {
    var $el = $(this);
    var err = getError($el);
    if (err) {
      arr.push(err);
    }
  });
  return arr;
};
