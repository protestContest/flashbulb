$(document).ready(function() {
    $("#editor").height($(window).height() - 150);
    var ctx = document.getElementById("editor").getContext("2d"),
        height = $("#editor img").height(),
        width = $("#editor img").width(),
        img = new Image(),
        filters;

    img.onload = function() {
        width = img.width;
        height = img.height;
        filters = createFilters();
        $("#editor").width($("#editor").height() * (width/height)),

        // scale canvas to image size
        $("#editor").attr("width", width);
        $("#editor").attr("height", height);
        ctx.drawImage(img, 0, 0);
    };
    img.src = $("#editor img").attr("src");

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
                $(".item.selected").removeClass("selected");
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

        var gradWidth = width,
            gradHeight = height;

        // x-pro filter
        filters["X-Pro"] = function() {
            ctx.fillStyle = ctx.createRadialGradient(gradWidth/2, gradHeight/2, 0, gradWidth/2, gradHeight/2, Math.min(gradWidth, gradHeight));
            ctx.fillStyle.addColorStop(0, "rgba(0, 0, 0, 0)");
            ctx.fillStyle.addColorStop(0.5, "rgba(0, 0, 0, 0.2");
            ctx.fillStyle.addColorStop(0.7, "rgba(0, 0, 0, 0.5");
            ctx.fillStyle.addColorStop(1, "rgba(0, 0, 0, 1)");
            ctx.fillRect(0, 0, width, height);
        };

        filters["Warm"] = function() {
            ctx.fillStyle = ctx.createRadialGradient(gradWidth/2, gradHeight/2, 0, gradWidth/2, gradHeight/2, Math.min(gradWidth, gradHeight));
            ctx.fillStyle.addColorStop(0, "rgba(255, 136, 10, 0.5)");
            ctx.fillStyle.addColorStop(0.5, "rgba(255, 136, 10, 0.2");
            ctx.fillStyle.addColorStop(0.7, "rgba(0, 0, 0, 0.2");
            ctx.fillStyle.addColorStop(1, "rgba(0, 0, 0, 0.5)");
            ctx.fillRect(0, 0, width, height);
        };

        filters["Black and White"] = function() {
            var imgData = ctx.getImageData(0, 0, width, height),
                pixels = imgData.data;
            for (var i = 0, n = pixels.length; i < n; i += 4) {
                var val = Math.max(pixels[i], pixels[i+1], pixels[i+2]);
                pixels[i] = val;
                pixels[i+1] = val;
                pixels[i+2] = val;
            }
            ctx.putImageData(imgData, 0, 0);
        };

        return filters;
    }

    window.addFilter = function(filter) {
        ctx.drawImage(img, 0, 0);
        if (filters[filter]) {
            filters[filter]();
        }
    }

    // colorize
    function colorize(colors) {
        ctx.drawImage(img, 0, 0);
        var imgData = ctx.getImageData(0, 0, width, height),
            pixels = imgData.data;

        for (var i = 0, n = pixels.length; i < n; i += 4) {
            for (var indexOffset = 0; indexOffset < 3; indexOffset++) {
                var scale = colors[indexOffset] / 100;
                var val = pixels[i + indexOffset];
                if (scale > 0) {
                    val += scale * (255 - val);
                } else if (scale < 0) {
                    val -= -scale*val;
                }
                pixels[i + indexOffset] = val;
            }
        }
        ctx.putImageData(imgData, 0, 0);
    }

    // bind tool buttons
    $(".tool-link .icon-filter").click(function() {
        $("aside").hide("slide", {"direction": "right"}, "fast");
        $("aside.filters").toggle("slide", {"direction": "right"}, "fast");
    });
    $(".tool-link .icon-adjust").click(function() {
        $("aside").hide("slide", {"direction": "right"}, "fast");
        $("aside.colors").toggle("slide", {"direction": "right"}, "fast");
    });

    $("aside.filters .item").click(function() {
        if ($(this).hasClass("selected")) {
            return;
        }
        $("aside .item").removeClass("selected");
        $(this).addClass("selected");
        var filter = $(this).html();
        addFilter(filter);
    });

    // bind color sliders
    ["red", "green", "blue"].forEach(function(color) {
        //document.getElementById(color).onchange = function() {
        $("#" + color).mouseup(function() {
            colorize([$("#red").val(), $("#green").val(), $("#blue").val()]);
        });
    });
});
