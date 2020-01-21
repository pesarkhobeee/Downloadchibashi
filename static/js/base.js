function submit_newsletter() {
  var email = $('#email').val();
  function fail() {
    show_msg('متاسفانه در روند عضویت شما با مشکل مواجه شدیم. لطفا دوباره تلاش کنید.', 'danger');
  }
  $.ajax({
    type: 'POST',
    url: '/newsletter/signup',
    data: JSON.stringify({'email': email}),
    contentType: 'application/json',
    dataType: 'json',
    success: function(data) {
      if (data.status == 'ok') {
        show_msg('با موفقیت در خبرنامه عضو شدید.', 'success');
      } else if (data.status == 'duplicate') {
        show_msg('ایمیل شما در خبرنامه عضو بود', 'warning');
      } else {
        fail();
      }
    },
    error: fail,
  });

  return false;
}

function show_msg(msg, alertType, presist) {
  var theDiv = $('#alert-div');
  var theAlert = $('<div class="alert alert-' + alertType + ' alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert" area-label="Close"><span aria-hidden="true">×</span></button>' + msg + '</div>');
    theDiv.append(theAlert);

  if (!presist) {
    theAlert.fadeTo(4000, 500).slideUp(500, function(){
      theAlert.alert('close');
    });
  }
}

$(function() {
// TODO
// if browser doesn't have html5 support
//  $('#newsletter-submit').on('click', submit_newsletter);
  $('#send-contact-button').on('click', function() {
    obj = {};
    obj['text'] = $('#contact-form textarea').val();
    obj['capcha'] = $('#capcha').val();
    function fail() {
          show_msg('متاسفانه در ثبت نظرتان مشکلی پیش آمد. لطفا دوباره امتحان کنید.', "danger");
    }
    $('#send-wait-gif').show();
    $.ajax({
      type: 'POST',
      url: '/contact/submit',
      data: JSON.stringify(obj),
      contentType: 'application/json',
      dataType: 'json',
      success: function(data) {
        if (data.status == "ok") {
          show_msg('پیام شما ثبت شد. متشکریم.', "success");
          $('#contact-modal textarea').val('');
        } else if (data.status == "capchafail") {
          show_msg('جواب اشتباه به سوال تشخیص انسان از ربات', "danger");
	} else {
          fail();
        }
      },
      error: fail,
      complete: function() {
        $('#contact-modal').modal('hide');
        $('#send-wait-gif').hide();
      },
    });
  });
});

$(function () {
  $('[data-toggle="popover"]').popover();
  $('#nav-brand').popover('show');
  window.setTimeout(function() {
    $('#nav-brand').popover('hide');
  }, 5000);

})
