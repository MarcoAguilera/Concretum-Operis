var page = 2;
var foundAll = false;
var id = $("#projectPortId").val();
var svg = document.getElementsByClassName("loading_svg")[0];

console.log(svg);

window.onscroll = function(ev) {
    if (((window.innerHeight + window.scrollY) >= document.body.scrollHeight) && foundAll == false) {
        // you're at the bottom of the page
        var url_imgs = '/more_imgs/' + id + "/"+ page;
        svg.style.opacity = "1";
        $.ajax( {
            url: url_imgs,
            type: "POST",
            contentType: 'application/json',
            async: false,
            success: function(res) {
                if (res['html'] == null) {
                    foundAll = true;
                }
                else {
                    var div = document.getElementsByClassName('project-root__gallery')[0];
                    div.innerHTML += res['html'];
                    page = page + 1;
                }
                svg.style.opacity = "0";
            },
            error: function() {
                alert("Ajax not successful");
                svg.style.opacity = "0";
            }
            
        });
    }
};