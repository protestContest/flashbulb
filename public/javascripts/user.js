$(document).ready(function() {
    $('.thumb').hover(function() {
        $(this).children('.thumbinfo').slideToggle("fast");
        $(this).find('.overlay-buttons').toggle();
    });

    $(".icon-share").click(function() {
        var img, imgTitle, imgPath;
       
       img = $(this).closest(".thumb").children("img");
       imgPath = img.attr("src");
       imgTitle = img.attr("alt");

       $("#share-image").attr("src", imgPath);
       $("#share-image-title").html(imgTitle);

       $("#share.dropdown").slideDown();
    });

    $(".dropdown .close").click(function() {
        $(this).closest(".dropdown").slideUp();
    });
});
