
suite('valid', function() {

  suite('init', function() {
    test('pass in native form element');
    test('pass in jquery form element');
  });

  suite('required', function() {

    var form;
    setup(function() {
      form = $('#form1');
      form.find('input').val('');
    });

    test('input - empty', function() {
      var errors = valid(form);

      assert.equal(errors instanceof Array, true);
      assert.equal(errors.length, 1);
      assert.equal(typeof errors[0].element, "object");
      assert.equal(errors[0].element.className, "f1i1");
      assert.equal(errors[0].type, 'required');
      assert.equal(errors[0].error, 'This is required');
    });

    test('input - filled', function() {
      form.find('input').val('name');

      var errors = valid(form);

      assert.equal(errors, false);
    });
  });

  suite('pattern', function() {

    var form;
    setup(function() {
      form = $('#form2');
      form.find('input').val('');
    });

    test('input - empty', function() {
      var errors = valid(form);

      assert.equal(errors instanceof Array, true);
      assert.equal(errors.length, 1);
      assert.equal(typeof errors[0].element, "object");
      assert.equal(errors[0].type, 'pattern');

    });

    test('input - valid', function() {
      form.find('input').val(10);

      var errors = valid(form);

      assert.equal(errors, false);

    });

    test('input - invalid', function() {
      form.find('input').val('a');

      var errors = valid(form);

      assert.equal(errors instanceof Array, true);
      assert.equal(errors.length, 1);
      assert.equal(typeof errors[0].element, "object");
      assert.equal(errors[0].type, 'pattern');

    });

  });

  suite('multiple fields', function() {

    var form;
    setup(function() {
      form = $('#form3');
      form.find('input').val('');
    });

    test('both empty', function() {
      var errors = valid(form);

      assert.equal(errors instanceof Array, true);
      assert.equal(errors.length, 2);

      assert.equal(typeof errors[0].element, "object");
      assert.equal(errors[0].element.className, "f3i1");
      assert.equal(errors[0].type, 'required');
      assert.equal(errors[0].error, 'This is required');

      assert.equal(typeof errors[1].element, "object");
      assert.equal(errors[1].element.className, "f3i2");
      assert.equal(errors[1].type, 'required');
      assert.equal(errors[1].error, 'This is required');
    });

    test('one valid', function() {
      form.find('input:eq(0)').val('name');
      var errors = valid(form);


      assert.equal(errors instanceof Array, true);
      assert.equal(errors.length, 1);

      assert.equal(typeof errors[0].element, "object");
      assert.equal(errors[0].element.className, "f3i2");
      assert.equal(errors[0].type, 'required');
      assert.equal(errors[0].error, 'This is required');
    });


    test('both valid', function() {
      form.find('input').val('name');
      var errors = valid(form);

      assert.equal(errors, false);
    });

  });

});
