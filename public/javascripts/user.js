$(document).ready(function() {
    $(".dropdown .close").click(function() {
        $(this).closest(".dropdown").slideUp();
    });

    $('.thumb').hover(function() {
        $(this).children('.thumbinfo').slideToggle("fast");
        $(this).find('.overlay-buttons').toggle();
    });

    $(".icon-share").click(function(evt) {
        var img, imgTitle, imgPath, imgRowHead, imgRowHeadIndex, shareDropdown, that;
        that = $(this);
        evt.preventDefault();

        $("#share.dropdown").slideUp("fast", function() {
            shareDropdown = $(this).remove();
            img = that.closest(".thumb").children("img");
            imgPath = img.attr("src");
            imgTitle = img.attr("alt");
            imgRowHeadIndex = Math.floor($(".thumb").index(that.closest(".thumb")) / 4) * 4;
            imgRowHead = that.closest(".row").children()[imgRowHeadIndex];

            shareDropdown.insertBefore(imgRowHead);
            $("#share-image").attr("src", imgPath);
            $("#share-image-title").html(imgTitle);
            shareDropdown.slideDown("fast");
        });

    });

    $(window).scroll(function() {
        $(".toolbar.navbar-fixed-top").css("top",Math.max(0,52-$(this).scrollTop()));
        console.log($(this).css("top"));
    });
});
