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

        // TODO: make this only bind once
        html.find(".toolbar-link").each(function(i, link) {
            $(this).click(function() {
                var href = $(link).attr("data-href");

                page.load(href);
            });
        });
    };

    /**
     * Changes the message displayed
     * @param {string} new value for message
     */
    this.updateMessage = function(message) {
        html.find("#messages").fadeOut(function() {
           $(this).html(message).fadeIn(); 
        });
    };

    this.update = function(newToolbar) {
        html.replaceWith(newToolbar);
        html = $(html.selector);
        self.init();
    };

};
