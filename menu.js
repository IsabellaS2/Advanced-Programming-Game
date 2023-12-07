// menu.js
$(document).ready(function () {
  $("#onePlayerBtn").click(function () {
    window.location.href = "index.html";
  });

  $("#playerVsPlayerBtn").click(function () {
    window.location.href = "index.html?mode=playerVsPlayer";
  });
});
