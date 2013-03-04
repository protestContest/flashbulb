$(document).ready(function() {

    $('.thumb').hover(function() {
        $(this).children('.thumbinfo').slideToggle("fast");
        $(this).find('.overlay-buttons').toggle();
    });

    $(".icon-share").click(function(evt) {

        var img, imgTitle, imgPath, imgRowHead, imgRowHeadIndex, shareDropdown, that;
        that = $(this);

        $("#share.dropdown").slideUp("fast", function() {
            // remove dropdown
            shareDropdown = $(this).remove();
            // image clicked
            img = that.closest(".thumb").children("img");
            imgPath = img.attr("src");
            imgTitle = img.attr("alt");
            // find the image at the beginning of this row
            imgRowHeadIndex = Math.floor($(".thumb").index(that.closest(".thumb")) / 4) * 4;
            imgRowHead = that.closest(".row").children()[imgRowHeadIndex];

            // put dropdown before row's first image
            shareDropdown.insertBefore(imgRowHead);
            // edit dropdown content
            $("#share-image").attr("src", imgPath);
            $("#share-image-title").html(imgTitle);
            // show dropdown
            shareDropdown.slideDown("fast");

            // register close button
            $(".close").click(function() {
                $(".dropdown").slideUp();
            });
        });

    });

    $(window).scroll(function() {
        $(".toolbar.navbar-fixed-top").css("top",Math.max(0,52-$(this).scrollTop()));
        console.log($(this).css("top"));
    });
});
