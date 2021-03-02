
var show = document.getElementById("show");
var previewImg = document.getElementById("previewImg");
var previewDiv = document.getElementById("previewDiv");
var previewName = document.getElementById("previewName");


function openInput(name) {
    $(name).click();
}

function setName(name) {
    previewName.innerText = name;
}

function showPreview(files) {
    previewImg.src = window.URL.createObjectURL(files[0]);
    // previewDiv.style.display = "block";
} 

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function loadSVG() {
    $('#loading_svg').css({opacity: 1});
}

function showImgs(files) {
    removeAllChildNodes(show);
    $(show).css("display", "flex");
    var img = Array.from(files);
    console.log(img);

    for(i = 0; i < files.length; i++) {

        var new_img = document.createElement("img");
        new_img.src = window.URL.createObjectURL(files[i]);
        // $(new_img).click(function() {
        //     $(this).toggleClass("removeSelect");
        // });
        new_img.className = "show-imgs"
        show.appendChild(new_img);
    }
}

function removeImgs() {
    var imgs = document.getElementsByClassName("show-imgs");
    
    document.getElementsByName("projectPhotos").files;

    for(i = 0; i < imgs.length; i++) {
        if (imgs[i].classList.contains("removeSelect") == true) {
            imgs = imgs.splice(i, 1);
        }
    }

    console.log(imgs);
}
