var page = 2;
var foundAll = false;
var ajaxInProg = false;
var id = $("#projectPortId").val();
var svg = document.getElementById("loading_svg");

window.onscroll = function(ev) {
    if (((window.innerHeight + window.scrollY) >= document.body.scrollHeight) && foundAll == false && ajaxInProg == false) {
        ajaxInProg = true;
        var url_imgs = '/more_imgs/' + id + "/"+ page;
        
        gsap.to(svg, {duration: .5, opacity: 1});
    
        $.ajax( {
            url: url_imgs,
            type: "POST",
            contentType: 'application/json',
            async: true,
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
            complete: function() {
                ajaxInProg = false;
                gsap.to(svg, {duration: .5, opacity: 0});
            },
            error: function() {
                alert("Ajax not successful");
            }
        });
    }
};