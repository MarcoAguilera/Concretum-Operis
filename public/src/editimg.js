function editImage(parent) {
    var img_id = parent.childNodes[3].childNodes[1].value;
    var img = parent.childNodes[1].childNodes[1];
    var img_title = document.getElementById(img_id + "-title").placeholder;
    var img_desc = document.getElementById(img_id + "-desc").placeholder;

    img = img.cloneNode(true);  
    img.className = "edit-popup__view-image";

    document.getElementsByClassName('edit-popup__view')[0].insertBefore(img, document.getElementsByClassName('edit-popup__view')[0].firstChild);
    document.getElementById('edit-popup').style.opacity = "1";
    document.getElementById('edit-popup').style.visibility = "visible";

    $('.edit-popup__view-title').attr("value", img_title);
    $('.edit-popup__view-desc').attr("value", img_desc);
    $('.edit-popup__view-img-data').attr("value", img_id);
}

$('.edit-popup').on('click', function(event) {
    if (event.target.id == "edit-popup") {
        var div = document.getElementsByClassName('edit-popup__view')[0];
        div.removeChild(div.firstChild);
        document.getElementById('edit-popup').style.opacity = "0";
        document.getElementById('edit-popup').style.visibility = "hidden";
    }
});