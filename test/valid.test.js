
suite('valid', function() {

  suite('init', function() {
    test('function exists', function() {
      assert.ok(typeof $.fn.valid === 'function');
    });
  });

  suite('custom validator', function() {
    test('custom validator is function', function() {
      $('form').valid({
        customValidators: {
          phone: function(input) {
            return input;
          }
        }
      });

      assert.equal($('form').valid('phone', 'test'), 'test');
    });

    test('custom validator should have access to methods', function() {
      $('form').valid({
        customValidators: {
          phone: function(input) {
            return typeof this.validate === 'object';
          }
        }
      });

      assert.ok($('form').valid('phone'));
    });
  });

  suite('events', function() {
    test('inputInvalid', function(done) {
      var form = $('#invalid');
      form.valid();

      form.on('inputInvalid', function(input, data) {
        assert.ok(input);
        assert.ok(data);
        form.unbind('inputInvalid');
        done();
      });

      form.trigger('submit');
    });

    test('inputValid', function(done) {
      var form = $('#valid');
      form.valid();

      form.on('inputValid', function() {
        assert.ok(true);
        form.unbind('inputValid');
        done();
      });

      form.trigger('submit');
    });

    test('inputPassing', function(done) {
      var form = $('#valid');
      form.valid();

      form.on('inputPassing', function(input) {
        assert.ok(input);
        form.unbind('inputPassing');
        done();
      });

      form.find('input').first().trigger('input');
    });

    test('inputFailing', function(done, data) {
      var form = $('#invalid');
      form.valid();

      form.on('inputFailing', function(input, data) {
        assert.ok(input);
        assert.ok(data);
        form.unbind('inputFailing');
        done();
      });

      form.find('input').first().trigger('input');
    });

    test('formInvalid', function(done, data) {
      var form = $('#invalid');
      form.valid();

      form.on('formInvalid', function(e, input, data) {
        assert.ok(input);
        assert.ok(data);
        form.unbind('formInvalid');
        done();
      });

      form.trigger('submit');
    });

    test('formValid', function(done, data) {
      var form = $('#valid');
      form.valid();

      form.on('formValid', function(e, input, data) {
        assert.ok(input);
        form.unbind('formValid');
        done();
      });

      form.trigger('submit');
    });
  });

});
