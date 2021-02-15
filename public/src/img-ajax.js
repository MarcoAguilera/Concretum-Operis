var page = 2;
var foundAll = false;
var id = $("#projectPortId").val();
var svg = document.getElementById("loading_svg");

window.onscroll = function(ev) {
    if (((window.innerHeight + window.scrollY) >= document.body.scrollHeight) && foundAll == false) {
        // you're at the bottom of the page
        var url_imgs = '/more_imgs/' + id + "/"+ page;
        
        $.ajax( {
            url: url_imgs,
            type: "POST",
            contentType: 'application/json',
            async: false,
            beforeSend: function() {
                $(svg).show(0);
            },
            complete: function() {
                $(svg).hide(0);
            },
            success: function(res) {
                if (res['html'] == null) {
                    foundAll = true;
                }
                else {
                    var div = document.getElementsByClassName('project-root__gallery')[0];
                    div.innerHTML += res['html'];
                    page = page + 1;
                }
            },
            error: function() {
                alert("Ajax not successful");
            }
        });
    }
};