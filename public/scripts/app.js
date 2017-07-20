$(() => {
  $.ajax({
    method: "GET",
    url: "/poll_info"
  }).done((poll_info) => {
    for(user of poll_info) {
      $("<div>").text(poll_info.email).appendTo($("body"));
    }
  });;
});

