$(document).ready(function() {
    $("#editor").height($(window).height() - 150);
    var ctx = document.getElementById("editor").getContext("2d"),
        height = $("#editor img").height(),
        width = $("#editor img").width(),
        img = new Image(),
        filters;

    img.src = "/photos" + $("#editor img").attr("src");
    img.onload = function() {
        width = img.width;
        height = img.height;
        filters = createFilters();
        $("#editor").width($("#editor").height() * (width/height));

        // scale canvas to image size
        $("#editor").attr("width", width);
        $("#editor").attr("height", height);
        ctx.drawImage(img, 0, 0);

    };


    $(".save").click(function(e) {
        e.preventDefault();
        var url = $(this).attr("href"),
            canvas = document.getElementById("editor"),
            data = canvas.toDataURL("image/jpeg"),
            formData = new FormData();

        
        formData.append("_method", "put");
        formData.append("image", data);

        $.ajax({
            "url": url,
            "data": formData,
            "cache": false,
            "contentType": false,
            "processData": false,
            "type": "POST",
            "success": function(res, status) {
                console.log("Saved image: " + status);
                window.page.showMessage("Photo saved");
            },
            "error": function(xhr, status) {
                console.warn("Image not saved: " + status);
                window.page.showMessage("<i class='icon-warning-sign'></i> Photo not saved", 2000);
            }
        });

    });

    // filter functions
    function createFilters() {
        var filters = {};

        // x-pro filter
        var gradWidth = width,
            gradHeight = height;
        var xpro = ctx.createRadialGradient(gradWidth/2, gradHeight/2, 0, gradWidth/2, gradHeight/2, Math.min(gradWidth, gradHeight));
        xpro.addColorStop(0, "rgba(0, 0, 0, 0)");
        xpro.addColorStop(0.5, "rgba(0, 0, 0, 0.2");
        xpro.addColorStop(0.7, "rgba(0, 0, 0, 0.5");
        xpro.addColorStop(1, "rgba(0, 0, 0, 1)");
        filters["xpro"] = xpro;

        // lo-fi filter
        filters["bright"] = "rgba(255, 255, 255, 0.2)";

        return filters;
    }

    window.addFilter = function(filter) {
        ctx.drawImage(img, 0, 0);
         if (filters[filter]) {
            ctx.fillStyle = filters[filter];
            ctx.fillRect(0, 0, width, height);
        }
    }

    // bind tool buttons
    $(".tool-link .icon-filter").click(function() {
        $("aside").toggle("slide", {"direction": "right"}, "fast");
    });

    $("aside .item").click(function() {
        if ($(this).hasClass("selected")) {
            return;
        }
        $("aside .item").removeClass("selected");
        $(this).addClass("selected");
        var filter = $(this).html();
        addFilter(filter);
    });
});
