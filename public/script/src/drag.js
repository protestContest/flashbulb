$(document).ready(function() {
    $("img").each(function(i, el) {
        el.setAttribute("draggable", "true");
        addEvent(el, "dragstart", function(e) {
            $("aside").show("slide", {direction: "right"}, 100);
            e.dataTransfer.effectAllowed = "copy";
            e.dataTransfer.setData("Text", $(el).attr("src"));
            return false;
        });

        addEvent(el, "dragend", function(e) {
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

            var url = e.dataTransfer.getData("Text");
            console.log(url);

            return false;
        });
    });
});
