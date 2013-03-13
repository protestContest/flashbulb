/**
 * Manages a toolbar jQuery object
 * @constructor
 * @param {Page} page that controls this toolbar
 * @param {object} jQuery object this controls
 */
function Toolbar(page, html) {
    var links = html.find(".toolbar-link");
    
    /**
     * Binds events
     */
    this.init = function() {
        $(window).scroll(function() {
            html.css("top", Math.max(0, 52 - $(window).scrollTop()));
        });

        links.forEach(function(link) {
            var that = this;

            $(this).click(function() {
                var href = that.attr("data-href");

                page.loadPage(href);
            });
        });
    };

    /**
     * Changes the message displayed
     * @param {string} new value for message
     */
    this.updateMessage = function(message) {
        html.find("#messages").html(message);
    };

};
