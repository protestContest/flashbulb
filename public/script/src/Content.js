function Content (page, html) {
    var self = this;

    this.init = function() {
        $(".thumb").hover(function() {
            $(this).children(".thumbinfo").slideToggle("fast");
            $(this).find(".overlay-buttons").toggle();
        });

        $(".icon-share").click(function(evt) {
            showDropdown($(this));
        });
    };

    this.update = function(newContent) {
        html.fadeOut("fast", function() {
            html.replaceWith(newContent);
            html = $(html.selector);
            html.fadeIn("fast");
            self.init();
        });
    };
}

function showDropdown(that) {

    $("#share.dropdown").slideUp("fast", function() {
        
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
        $("#fb-submit").html("Share on Facebook");
        imgPath = imgPath.replace(/ /g, "%20");

        $("#irc_pc").css("left", ircpcOffset + "px");

        // show dropdown
        shareDropdown.slideDown("fast");

        // scroll window
        if (img.offset().top + 490 > $(window).scrollTop() + $(window).height()) {
            $("html, body").animate({
                scrollTop: img.offset().top - ($(window).height() - 500)
            });
        }

        // register close button
        $(".close").click(function() {
            $(".dropdown").slideUp();
        });

        // facebook upload sumbit
        $("#fb-submit").click(function(evt) {
            evt.preventDefault();

            $(this).html("<i class='icon-spinner icon-spin'></i> Sharing...");
            $(this).attr("disabled", "disabled");

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
                        $("#fb-submit").html("Shared!");
                        setTimeout($("#share.dropdown").slideUp(), 1500);
                    }
                });

                $("#fbSource").attr("value", "@" + publicUrl.url);
            }, "json");

        });
    });
}
