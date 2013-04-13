$(document).ready(function() {
    var ctx = document.getElementById("editor").getContext("2d"),
        height = $("#editor img").height(),
        width = $("#editor img").width(),
        img = new Image();

    img.src = "/photos" + $("#editor img").attr("src");
    img.onload = function() {
        $("#editor").attr("width", img.width);
        $("#editor").attr("height", img.height);
        ctx.drawImage(img, 0, 0);
    };


    $(".save").click(function(e) {
        e.preventDefault();
    });
});
