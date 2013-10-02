
var valid = function(el) {
  // jquery the selector
  var $el = $(el);
  // narrow selection to only these validations
  var $els = $el.find('[data-valid-required], [data-valid-pattern]');
  // storage array to return
  var arr = [];

  // check for errors
  var getError = function(element) {
    // jquery the selector
    var $element = $(element);
    // trim the whitespace on inputs
    var $value = $.trim($element.val());
    // set the default error
    var error = false;
    var type = 'required';

    // test the regex pattern
    if ($element.data('valid-pattern')) {
      type = 'pattern';
      var regex = new RegExp($element.data('valid-pattern'));
      // test() will return true for a match
      // want to reverse that so it reads like english
      // i.e. if there is an error, set error to true
      error = ! regex.test($element.val());
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
