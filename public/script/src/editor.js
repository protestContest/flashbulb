$(document).ready(function() {
    var ctx = document.getElementById("editor").getContext("2d"),
        img = new Image();
    img.src = "/photos" + $("#editor").attr("data-img");
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
    };
});
