'use strict';

$(document).ready(function () {
  $("#search").keyup(function () {
    var $value = this;

    $.each($("#table tr"), function () {
      if ($(this).text().toLowerCase().indexOf($($value).val().toLowerCase()) === -1)
        $(this).hide();
      else
        $(this).show();
    });
  });
});
