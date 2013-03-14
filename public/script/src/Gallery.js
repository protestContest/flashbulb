// js_middleware_import script/src/Content.js

/**
 * Manages a content jQuery object of type gallery
 * @constructor
 * @param {Page} page that controls this gallery
 * @param {object} jQuery object this controls
 */
Gallery.prototype = Content;
Gallery.prototype.constructor = Gallery;
function Gallery(page, html) {
    /**
     * Binds events
     */
    this.init = function() {
        $(".thumb").hover(function() {
            $(this).children(".thumbinfo").slideToggle("fast");
            $(this).find(".overlay-buttons").toggle();
        });
    };
};
