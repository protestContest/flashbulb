// js_middleware_import script/src/Page.js

$(document).ready(function() {
    console.log("Creating page");
    window.page = new Page($("#toolbar"), $("#content"));
    page.init();
    page.showMessage("Welcome!", 2000);
});
