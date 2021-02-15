var page = 2;
var foundAll = false;
var id = $("#projectPortId").val();
var svg = document.getElementById("loading_svg");

async function showIcon(svg) {
    await gsap.to(svg, {duration: 0.3, opacity: 1});
}

async function hideIcon(svg) {
    await gsap.to(svg, {duration: 0.3, opacity: 0});
}

window.onscroll = function(ev) {
    if (((window.innerHeight + window.scrollY) >= document.body.scrollHeight) && foundAll == false) {
        // you're at the bottom of the page
        var url_imgs = '/more_imgs/' + id + "/"+ page;
        
        showIcon(svg);

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

                hideIcon(svg);
            },
            error: function() {
                hideIcon(svg);
                alert("Ajax not successful");
            }
        });
    }
};