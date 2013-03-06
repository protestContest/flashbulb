$(document).ready(function() {

    $('.thumb').hover(function() {
        $(this).children('.thumbinfo').slideToggle("fast");
        $(this).find('.overlay-buttons').toggle();
    });

    $(".icon-share").click(function(evt) {
        that = $(this);

        $("#share.dropdown").slideUp("fast", function() {
            var img, imgTitle, imgPath, imgRowTail, imgRowTailIndex, shareDropdown,
                imgIndex, ircpcOffset;

            // remove dropdown
            shareDropdown = $(this).remove();
            // image clicked
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
            $("#share-link").attr("href", "/share" + imgPath);
            $("#irc_pc").css("left", ircpcOffset + "px");
            // show dropdown
            shareDropdown.slideDown("fast");
            // scroll window
            if ($(that).offset().top + 490 > $(window).scrollTop() + $(window).height()) {
                $("html, body").animate({
                    scrollTop: $(that).offset().top - ($(window).height() - 490)
                });
            }


            // register close button
            $(".close").click(function() {
                $(".dropdown").slideUp();
            });


            $("#share-link").click(function() {
                console.log("Sharing to " + "/share" + $("#share-image").attr("src"));
                console.log(window.location.pathname);
                $.post("/share" + $("#share-image").attr("src"), {
                    "url": $("#share-image").attr("src"),
                    "desc": $("#share-desc").val(),
                    "returnURL": window.location.pathname
                }, function(data, textStatus, jqXHR) {
                    console.log(data);
                    if (data.redirect) {
                        window.location = data.redirect;
                    }
                });
            });
        });

    });


    $(window).scroll(function() {
        $(".toolbar.navbar-fixed-top").css("top",Math.max(0,52-$(this).scrollTop()));
        console.log($(this).css("top"));
    });
});
