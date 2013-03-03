$(document).ready(function() {
    $('.thumb').hover(function() {
        $(this).children('.thumbinfo').slideToggle();
        $(this).find('.thumb-overlay').toggle();
    });
});