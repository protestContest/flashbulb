// js_middleware_import script/src/Toolbar.js
// js_middleware_import script/src/Gallery.js

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

        window.onpopstate = function(evt) {
            if (evt.state === null) {
                self.load("/all");
            } else {
                self.update(evt.state);
            }
        };
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
