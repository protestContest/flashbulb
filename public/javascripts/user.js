var init = function() {

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

            $("#irc_pc").css("left", ircpcOffset + "px");

            // show dropdown
            shareDropdown.slideDown("fast");

            // scroll window
            if (img.offset().top + 490 > $(window).scrollTop() + $(window).height()) {
                $("html, body").animate({
                    scrollTop: img.offset().top - ($(window).height() - 490)
                });
            }

            // register close button
            $(".close").click(function() {
                $(".dropdown").slideUp();
            });

            // facebook upload sumbit
            $("#fb-submit").click(function(evt) {
                evt.preventDefault();

                console.log("Posting to Facebook..");

                $.get("/public" + imgPath, function(publicUrl, status) {
                    var formData = new FormData();
                    formData.append("url", publicUrl.url);
                    formData.append("message", $("#share-desc").val());

                    $.ajax({
                        "url": $("#shareform").attr("action"),
                        "data": formData,
                        "cache": false,
                        "contentType": false,
                        "processData": false,
                        "type": "POST",
                        "success": function(data) {
                            console.log("POST SUCCESSFUL");
                        }
                    });

                    $("#fbSource").attr("value", "@" + publicUrl.url);
                }, "json");

            });


        });

    });


    $(window).scroll(function() {
        $(".toolbar.navbar-fixed-top").css("top",Math.max(0,52-$(this).scrollTop()));
    });





    $("#albums").click(function() {
        $("*").css("cursor", "wait");
        $.getJSON("/albums", function(state) {
            $(".main.container").fadeOut("fast", function() {
                window.history.pushState(state, "Albums", "/albums");
                $("*").css("cursor", "");
                $(this).replaceWith(state.content);
                $(".toolbar").replaceWith(state.toolbar);
                $(".main.container").hide().fadeIn("fast");
                init();
            });
        });
    });

    $("#all").click(function() {
        $("*").css("cursor", "wait");
        $.getJSON("/all", function(state) {
            $(".main.container").fadeOut("fast", function() {
                window.history.pushState(state, "All Pictures", "/all");
                $("*").css("cursor", "");
                $(this).replaceWith(state.content);
                $(".toolbar").replaceWith(state.toolbar);
                $(".main.container").hide().fadeIn("fast");
                init();
            });
        });
    });

};

window.onpopstate = function(evt) {
    $(".main.container").hide();

    if (evt.state === null) {
        $("*").css("cursor", "wait");
        $("html, body").css("height", "100%");
        $.getJSON("/all", function(state) {
            $("*").css("cursor", "");
            $("html, body").css("height", "");

            $(".main.container").replaceWith(state.content);
            $(".toolbar").replaceWith(state.toolbar);
            $(".main.container").fadeIn("fast");
            init();
        });
    } else {
        $(".main.container").replaceWith(evt.state.content);
        $(".toolbar").replaceWith(evt.state.toolbar);
        $(".main.container").fadeIn("fast");
        init();
    }

};

$(document).ready(init);
