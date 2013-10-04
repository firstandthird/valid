var valid = function(el) {
  // jquery the selector
  var $el = $(el);
  // narrow selection to only these validations
  var $els = $el.find('[data-valid-required], [data-valid-pattern], [data-valid-email]');
  // storage array to return
  var arr = [];

  // tests the pattern against the value that is passed
  // return true if there is a match
  var testPattern = function(value, pattern) {
      var regex = new RegExp(pattern);
      return regex.test(value);
  };

  // strip punctuation
  var stripText = function( text ) {
      var strip = text.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"");
      return strip.replace(/\s{2,}/g," ");
  };

  // grab the error messages
  var getErrMsg = function(element) {
    var id = element.attr( 'id' );
    var label = $('label[for="' + id + '"]');
    return ( label.length && label.attr( 'data-valid-label' ) ) ? label.data( 'valid-label' ) : $.trim( stripText( label.text() ) );
  }

  // check for errors with the passed in element
  var getError = function(element) {
    // jquery the selector
    var $element = $(element);
    // trim the whitespace on inputs
    var $value = $.trim($element.val());
    // set the default error
    var error = false;
    // the type; pattern, email, url, or required
    var type; 
    // the regex pattern to test
    var pattern;
    // the message
    var message;

    // test the regex pattern
    if ($element.data('valid-pattern')) {
      type = 'pattern';
      // grab the pattern that is passed in from the view
      pattern = $element.data('valid-pattern');
      // structure the message for the pattern
      message = getErrMsg($element) + ' is not a valid';
      // test() will return true for a match
      // want to reverse that so it reads like english
      // i.e. if there is an error, set error to true
      error = ! testPattern($element.val(), pattern);
    }
    // test the email pattern
    if ($element.data('valid-email') === '') {
      type = 'email';
      // this pattern came from a site that specified that
      // this will match the RFC 5322 spec
      pattern = /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      // structure the message for the email
      message = getErrMsg($element) + ' is not valid email address';
      //run the pattern check with this pattern
      // needs to return true if there is an error
      error = ! testPattern($element.val(), pattern);
    }

    // this will check for an empty value
    // covers the required case
    if ($element.data('valid-required') === '' && $value.length === 0) {
      type = 'required';
      // structure the message for the email
      message = getErrMsg($element) + ' is required';
      error = true;
    }

    if (!error) {
      return false;
    }

    return {
      'element' : $element[0],
      'type' : type,
      'message' : message
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
