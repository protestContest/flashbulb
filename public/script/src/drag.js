$(document).ready(function() {
    window.asideTimeout = setTimeout(function() {
        $("aside").hide("slide", {direction: "right"}, 100);
    }, 2000);

    $("img").each(function(i, el) {
        el.setAttribute("draggable", "true");
        addEvent(el, "dragstart", function(e) {
            var srcSplit = $(el).attr("src").split("/"),
                album = (srcSplit.length === 4) ? srcSplit[2] : "",
                photo = (srcSplit.length === 4) ? srcSplit[3] : srcSplit[2];

            clearTimeout(window.asideTimeout);
            $(el).addClass("dragElement");
            $("aside").show("slide", {direction: "right"}, 100);
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
            });

            return false;
        });
    });
});
