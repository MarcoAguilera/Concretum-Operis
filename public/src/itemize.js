var itemManager = new Itemize();

itemManager.apply(".edit-project__images", {
    dragAndDrop: true,
    removeBtnWidth: 0,
    removeBtnThickness: 0
});

function setOrder(projectId) {
    var items = $('.itmz_item');
    var Ids = []
    for(i = 0; i < items.length; i++) {
        Ids.push(items[i].childNodes[3].id);
    }

    $.ajax({
        async: true,
        url: "/setOrder",
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({Ids: Ids, projectId: projectId}),
        success: function(response) {
            if (response == "Success") {
                alert("Order Has Been Set.");
            }
            else {
                alert("Something Went Wrong!");
            }
        },
        error: function() {
            alert("Ajax not successful");
        }
    }); 
}
