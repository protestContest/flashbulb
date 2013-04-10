
// included: script/src/Page.js

// included: script/src/Toolbar.js
/**
 * Manages a toolbar jQuery object
 * @constructor
 * @param {Page} page that controls this toolbar
 * @param {object} jQuery object this controls
 */
function Toolbar(page, html) {
    var self = this;
    
    /**
     * Binds events
     */
    this.init = function() {
        $(window).scroll(function() {
            html.css("top", Math.max(0, 52 - $(window).scrollTop()));
        });

        // links on the left
        html.find(".toolbar-link").each(function(i, link) {
            if (! $(this).clickBound) {
                $(this).clickBound = true;
                $(this).click(function() {
                    var href = $(link).attr("data-href");

                    //page.load(href);
                });
            }
        });

        // buttons on the right
        html.find(".tool-link a").each(function(i, link) {
            if (! $(this).clickBound) {
                $(this).clickBound = true;
                $(this).click(function() {
                    console.log("Deleting");
                    if (confirm("Delete this album?")) {
                        var album = $(link).attr("data-delete");
                        console.log(album);
                        $.post("/albums/" + album, {
                            "_method": "delete"
                        }, function(data, status) {
                            console.log("Album deleted: " + status);
                            page.showMessage("Album deleted", 2000);
                        });
                    }
                });
            }
        });
    };

    /**
     * Changes the message displayed
     * @param {string} new value for message
     */
    this.updateMessage = function(message) {
        html.find("#messages").fadeOut(function() {
           $(this).html(message).fadeIn("fast"); 
        });
    };

    this.update = function(newToolbar) {
        html.replaceWith(newToolbar);
        html = $(html.selector);
        self.init();
    };

};


// included: script/src/Content.js
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

/**
 * Manages the current contents of the page
 *
 * @constructor
 * @param {object} jQuery object of toolbar
 * @param {object} jQuery object of content
 */
function Page(toolbarRef, contentRef) {
    var self = this,
        toolbar = new Toolbar(this, toolbarRef),
        content = new Content(this, contentRef);

    /**
     * Binds events
     */
    this.init = function() {
        toolbar.init();
        content.init();

        //window.onpopstate = function(evt) {
        //    if (evt.state === null) {
        //        self.load("/all");
        //    } else {
        //        self.update(evt.state);
        //    }
        //};
    };

    /**
     * Fetches pageState JSON from server and updates the page
     * @param {string} Location of the pageState JSON
     */
    this.load = function(url) {
        $("*").css("cursor", "wait");
        $.getJSON(url + ".json", function(newPage) {
            window.history.pushState(newPage, url, url);
            $("*").css("cursor", "");
            self.update(newPage);
        });
    };

    /**
     * Replaces this page with a new one
     * @param {object} pageState JSON object
     */
    this.update = function(newPage) {
        toolbar.update(newPage.toolbar);
        content.update(newPage.content);
        self.init();
    };

    /**
     * Places a message in the toolbar
     * @param {string} The message
     * @param {number} Optional length before message disappears, in
     *                 milliseconds
     */
    this.showMessage = function(message, timeout) {
        toolbar.updateMessage(message);
        if (timeout) {
            setTimeout(function() {
                toolbar.updateMessage("");
            }, timeout);
        }
    };

};

$(document).ready(function() {
    window.page = new Page($("#toolbar"), $("#content"));
    page.init();
    page.showMessage("Drag photos to organize", 2000);
});
