$(function () {
  $.ajax({
    url: 'http://127.0.0.1:28017/buyBuddyBeer/buddybeers/',
    type: 'get',
    dataType: 'jsonp',
    jsonp: 'jsonp', // mongod is expecting the parameter name to be called "jsonp"
    success: function (data) {
      console.log('success', data);
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      console.log('error', errorThrown);
    }
  });
})

var updateBuddy = function(data) {
  $.ajax({
    url: '/admin/update',
    type: 'POST',
    dataType: 'jsonp',
    jsonp: 'jsonp', // mongod is expecting the parameter name to be called "jsonp"
    success: function (data) {
      console.log('success', data);
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      console.log('error', errorThrown);
    }
  });
}
