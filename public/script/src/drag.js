$(document).ready(function() {
    window.asideTimeout = setTimeout(function() {
        $("aside").hide("slide", {direction: "right"}, 100);
    }, 2000);

    $("img").each(function(i, el) {
        if ($(el).hasClass("nodrag")) {
            el.setAttribute("draggable", "false");
        } else {
            el.setAttribute("draggable", "true");
        }
        addEvent(el, "dragstart", function(e) {
            var srcSplit = $(el).attr("src").split("/"),
                album = (srcSplit.length === 4) ? srcSplit[2] : "",
                photo = (srcSplit.length === 4) ? srcSplit[3] : srcSplit[2];

            clearTimeout(window.asideTimeout);
            $(el).addClass("dragElement");
            $("aside").show("slide", {direction: "right"}, 100);

            var dragIcon = document.createElement("img");
            dragIcon.src = "/image/drag.png";
            e.dataTransfer.setDragImage(dragIcon, 25, 25);
            e.dataTransfer.effectAllowed = "copy";
            e.dataTransfer.setData("Text", JSON.stringify({
                "from": "/" + album,
                "photo": "/" + photo,
                "src": $(el).attr("src")
            }));

            return false;
        });

        addEvent(el, "dragend", function(e) {
            $(".dragElement").removeClass("dragElement");
            $("aside").hide("slide", {direction: "right"}, 100);
        });
    });

    $(".gallery").each(function(i, el) {
        addEvent(el, "dragover", function(e) {
            if (e.preventDefault) e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
            return false;
        });

        addEvent(el, "drop", function(e) {
            var files = e.dataTransfer.files,
                album,
                formData = new FormData(),
                album_match = location.pathname.match(/\/albums\/(.*)/);

            if (e.stopPropagation) e.stopPropagation();
            e.preventDefault();

            if (album_match) {
                album = album_match[1];
            } else {
                album = "Unsorted";
            }

            //var tpl = Handlebars.compile($("#thumb-tpl").html());
            for(var i = 0; i < files.length; i++) {
                if (/image\/(jpeg|png|gif)$/.test(files[i].type)) {
                    formData.append("file-" + i, files[i]);
                }
            }

            $.ajax({
                "url": "/photos/" + album,
                "data": formData,
                "cache": false,
                "contentType": false,
                "processData": false,
                "type": "POST",
                "success": function(data, status) {
                    window.page.showMessage("Photo" + (files.length > 1 ? "s" : "") + " uploaded");
                }
            });

            return false;
        });
    });

    $("aside .album").each(function(i, el) {
        addEvent(el, "dragover", function(e) {
            if (e.preventDefault) e.preventDefault();
            this.className = "dragOver album";
            e.dataTransfer.dropEffect = "copy";
            return false;
        });

        addEvent(el, "dragleave", function() {
            this.className = "album";
        });

        addEvent(el, "drop", function(e) {
            if (e.stopPropagation) e.stopPropagation();
            e.preventDefault();

            this.className = "album";

            var data = JSON.parse(e.dataTransfer.getData("Text"));
            data.to = "/" + $(el).html();

            $("*[src='" + data.src + "']").css("opacity", "0.5");

            $.post("/move", data, function(postdata, status) {
                if (/albums/.test(window.location.href)) {
                    $("*[src='" + data.src + "']").closest(".thumb").fadeOut();
                } else {
                    $("*[src='" + data.src + "']").css("opacity", "1");
                }
                window.page.showMessage("Photo moved", 2000);
            });

            return false;
        });
    });
});
