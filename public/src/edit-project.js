$(".delete-project__icon").click(function() {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $('html, body').css({overflow: 'hidden', height: '100%'});
    $(".deleteProjPopup").show();
});

$(".deleteProjPopup-check__flex-keep").click(function() {
    $('html, body').css({overflow: 'auto',height: 'auto'});
    $(".deleteProjPopup").hide();
});

$(".deleteProjPopup-check__flex-delete").click(function() {
    var form = document.getElementsByClassName("delete-project")[0];
    $(form).submit();
});

$(".edit-project__images-div").on("click", function() {
    $(this).toggleClass("removeSelect");

    var elems = document.getElementsByClassName("removeSelect");
    $(".edit-project__navbar-delete").text("Delete Images: " + elems.length);
});

function toggleImgDiv() {
    $(".edit-project__images").toggleClass("toggleDiv");
    
    if($(".edit-project__navbar-show").text().trim() == "Show Images") {
        $(".edit-project__navbar-show").text("Hide Images");
    }
    else if($(".edit-project__navbar-show").text().trim() == "Hide Images") {
        $(".edit-project__navbar-show").text("Show Images");
    }
}

function deselectAll() {
    $(document.getElementsByClassName("removeSelect")).toggleClass("removeSelect");
    $(".edit-project__navbar-delete").text("Delete Images: 0");
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function showNewImgs(files) {
    var divShow = document.getElementById("new_imagesID");
    var formButton = document.getElementById("new_imagesID--button");

    removeAllChildNodes(divShow);
    $(divShow).css("display", "flex");
    $(formButton).css("display", "inline");
    var img = Array.from(files);
    console.log(img);

    for(i = 0; i < files.length; i++) {

        var new_img = document.createElement("img");
        var new_div = document.createElement("div");
        new_img.src = window.URL.createObjectURL(files[i]);
        // $(new_img).click(function() {
        //     $(this).toggleClass("removeSelect");
        // });
        new_img.className = "new_images_div-img"
        new_div.className = "new_images_div-div"

        new_div.appendChild(new_img);
        divShow.appendChild(new_div);
    }
}

function openExplore() {
    $(".edit-project__mainImg-uploaded").trigger("click");
}

function setNewHomeImg(files) {

    if (files.length > 0) {
        var names = document.getElementsByClassName("project_name");
        names[2].innerHTML = names[1].textContent;
        var img = document.getElementById("newHomeImg");
        img.src = window.URL.createObjectURL(files[0]);
    }
}

function setNewName() {
    var names = document.getElementsByClassName("project_name");
    names[1].innerHTML = names[0].value;
    if (names[2].textContent.trim() != "Click Me") {
        names[2].innerHTML = names[0].value;
    }
}

function imagesChanges() {

    var selected = document.getElementsByClassName("removeSelect");

    if (selected.length > 0) {
        var form = document.getElementById("finalDeleteForm");
        for(i = 0; i < selected.length; i++) {
            var input = document.createElement("input");
            input.name = "imgIds[]";
            input.value = selected[i].id;
            input.style.display = "none";
            form.appendChild(input);
        }

        $(form).submit();
    }
}