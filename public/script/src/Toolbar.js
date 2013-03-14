/**
 * Manages a toolbar jQuery object
 * @constructor
 * @param {Page} page that controls this toolbar
 * @param {object} jQuery object this controls
 */
function Toolbar(page, html) {
    var links = html.find(".toolbar-link");

    if(!Array.isArray(links)) {
        var oldLinks = links;
        links = [];
        links[0] = oldLinks;
    }
    
    /**
     * Binds events
     */
    this.init = function() {
        $(window).scroll(function() {
            html.css("top", Math.max(0, 52 - $(window).scrollTop()));
        });

        links.forEach(function(link) {
            var that = this;

            link.click(function() {
                var href = link.attr("data-href");

                page.load(href);
            });
        });
    };

    /**
     * Changes the message displayed
     * @param {string} new value for message
     */
    this.updateMessage = function(message) {
        html.find("#messages").fadeOut().html(message).fadeIn();
    };

    this.update = function(newToolbar) {
        html.replaceWith(newToolbar);
    };

};
