$(document).ready(function() {
    window.page.showMessage("Drag to organize photos", 2000);

    $("#delete-album-button").each(function(i, link) {
        if (! $(this).clickBound) {
            $(this).clickBound = true;
            $(this).click(function() {
                if (confirm("Delete this album? All photos in this album will also be deleted.")) {
                    var album = $(link).attr("data-delete");
                    console.log(album);
                    $.post("/albums/" + album, {
                        "_method": "delete"
                    }, function(data, status) {
                        console.log("Album deleted: " + status);
                        page.showMessage("Album deleted", 2000);
                    });
                }
            });
        }
    });
});
