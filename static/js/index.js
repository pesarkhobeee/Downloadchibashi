function check_url(input) {
  input = $(input);
  var url = input.val();
  if (url == '')
    return;
  if (!url.match(/^https?:\/\/.*/)) {
    url = "http://" + url;
    input.val(url);
  }
}

function get_vid() {
  var url = $('#url').val();
    if (url != undefined || url != '') {
      var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
      var match = url.match(regExp);
      if (match) {
        return match[2];
      }
    }

  return 'error';
}

function getFileSize(fileSizeInBytes) {

    var i = -1;
    var byteUnits = [' KB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
    do {
        fileSizeInBytes = fileSizeInBytes / 1024;
        i++;
    } while (fileSizeInBytes > 1024);

    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
}


function enable_modal_inputs() {
  $('#download-button').removeAttr('disabled');
  $('#quality-select').removeAttr('disabled');
}

function disable_modal_inputs() {
  $('#download-button').attr('disabled', 'disabled');
  $('#quality-select').attr('disabled', 'disabled');
}

$(function() {
  //don't disable the getQuality button
//  $('#url').on('input', check_url);
  $('#getQuality').on('click', function() {
    disable_modal_inputs();
    var vid = get_vid();
    if (vid == 'error') {
      show_msg('آدرس معتبر نمی‌باشد\nمثال: http://www.youtube.com/watch?v=abcdefghijk', 'danger', true);
      return;
    }
    $('#download-modal').modal('show');


    $('#wait-gif').show();
    var ajax_url = 'api/1/info/youtube/' + vid;
    $.ajax({
      url: ajax_url,
      success: function(result) {
        if (result.status == 'ok') {
          var q = result.quality;
          $('#quality-select').empty();
          var regex = /best/;
          for (var code in q) {
            if(q[code].match(regex))
              $('#quality-select').append('<option value="' + code + '" selected="selected">' + q[code] + '</option>');
            else
              $('#quality-select').append('<option value="' + code + '">' + q[code] + '</option>');
          }

          $('#title')[0].textContent = result['title'];
          $('#thumb')[0].src = result['thumb_url'];
          $('#title_thumb')[0].style['display'] = 'block';


        } else {
          show_msg('متاسفانه این آدرس امکان دانلود ندارد', 'danger', true);
          console.log('khaaaaaar');
          $('#download-modal').modal('hide');
        }
      },
      error: function() {
        show_msg('مشکل در اتصال به سرور. لطفا دوباره امتحان کنید.', 'danger', true);
        console.log('khaaaaaar')
        $('#download-modal').modal('hide');
      },
      complete: function() {
        $('#wait-gif').hide();
        enable_modal_inputs();
      }
    });
  });

  $('#download-modal').on('hidden.bs.modal', function() {
    $('#title_thumb').hide();
    $('#quality-select').empty();
    /* TODO: does not work
    console.log('before focus');
    $('#url').focus();
    console.log('after focus');
    */
  });

  $('#download-button').on('click', function () {
    var code = $('#quality-select').val();
    $('#wait-gif').show();
    disable_modal_inputs();
    $.ajax({
      url: "api/1/download/youtube/" + code + "/" + get_vid(),
      success: function(result) {
        if (result.status == 'ok') {
          $('#url-tbody').append("<tr><td><a href=\'" + result.url + "'>" + result.name + "</td><td>" + getFileSize(result.size) + "</td></tr>");
          $('#url-table').css('visibility', 'visible');
          $('#social').css('visibility', 'visible');
        } else {
          show_msg('خطا در دانلود کلیپ', 'danger', true);
        }
      },
      complete: function() {
        enable_modal_inputs();
        $('#wait-gif').hide();
        $('#download-modal').modal('hide');
        $('#thumb').attr('src', '');
      },
      error: function() {
        show_msg('خطا در دانلود کلیپ', 'danger', true);
      }
    });
  });
  $('#url').on('focus', function(ev) { ev.target.select();});

  /*
  if (check_url()) {
    $('#getQuality').click();
  }
  */
});
