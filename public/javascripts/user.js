$(document).ready(function() {

    $('.thumb').hover(function() {
        $(this).children('.thumbinfo').slideToggle("fast");
        $(this).find('.overlay-buttons').toggle();
    });

    $(".icon-share").click(function(evt) {
        that = $(this);

        $("#share.dropdown").slideUp("3000", function() {
            var img, imgTitle, imgPath, imgRowTail, imgRowTailIndex, shareDropdown,
                imgIndex, ircpcOffset;

            // remove dropdown
            shareDropdown = $(this).remove();

            img = that.closest(".thumb").children("img");
            imgPath = img.attr("src");
            imgTitle = img.attr("alt");

            // find the image at the beginning of this row
            imgIndex = $(".thumb").index(that.closest(".thumb"));
            imgRowTailIndex = Math.ceil((imgIndex + 1) / 4) * 4 - 1;
            imgIndexInRow = imgIndex - (imgRowTailIndex - 3);
            imgRowTail = that.closest(".row").children()[imgRowTailIndex];
            ircpcOffset = 240 * imgIndexInRow + 100;

            // put dropdown after row's last image
            shareDropdown.insertAfter(imgRowTail);

            // edit dropdown content
            $("#share-image").attr("src", imgPath);
            $("#share-image-title").html(imgTitle);
            imgPath = imgPath.replace(/ /g, "%20");
            // TODO: make this point to public dropbox url
            //$("#fbSource").attr("value", "@http://flashbulb.herokuapp.com" + imgPath);

            $("#irc_pc").css("left", ircpcOffset + "px");

            // show dropdown
            shareDropdown.slideDown("fast");

            // scroll window
            console.log($(that).offset().top);
            if ($(that).offset().top + 490 > $(window).scrollTop() + $(window).height()) {
                $("html, body").animate({
                    scrollTop: $(that).offset().top - ($(window).height() - 490)
                });
            }


            // register close button
            $(".close").click(function() {
                $(".dropdown").slideUp();
            });


        });

    });


    $(window).scroll(function() {
        $(".toolbar.navbar-fixed-top").css("top",Math.max(0,52-$(this).scrollTop()));
    });

});

