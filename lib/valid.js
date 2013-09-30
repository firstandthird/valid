
var valid = function( el ) {
  // jquery the selector
  var $el = $( el );
  // narrow selection to only these validations
  var $els = $el.find( '[data-pattern], [data-required]' );
  // storage array to return
  var arr = [];

  // check for errors
  var hasError = function( element ) {
    // jquery the selector
    var $element = $( element );
    // trim the whitespace on inputs
    var $value = $.trim( $element.val() );
    // set the default error
    var error = false;

    // test the regex pattern
    if ( $element.data( 'pattern' ) ) {
      var regex = new RegExp( $element.data( 'pattern' ) );
      // test() will return true for a match
      // want to reverse that so it reads like english
      // i.e. if there is an error, set error to true
      error = ! regex.test( element.value );
    }

    // this will check for an empty value
    // covers the required case
    if ( $value.length === 0 ) {
      error = true;
    }

    return error;
  };

  $.each( $els, function() {
    var $el = $( this );
    if ( hasError( $el ) ) {
      arr.push({
        'type' : $el.attr( 'type' ),
        'element' : $el[0],
        'error' : ( $el.data( 'required' ) !== null ) ? 'required' : 'invalid'
      });
    }
  });
  return arr;
};
