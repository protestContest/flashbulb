/**
 * Manages a content jQuery object of type gallery
 * @constructor
 * @param {Page} page that controls this gallery
 * @param {object} jQuery object this controls
 */

Content = {
    html: {},
    page: {},

    testFunc: function() {
        console.log("Content test");
    },

    update: function(newContent) {
        var html = this.html;
        html.fadeOut("fast", function() {
            html.replaceWith(newContent);
            html.fadeIn("fast");
        });
    }
};
