var page = 2;
var foundAll = false;
var id = $("#projectPortId").val();

window.onscroll = function(ev) {
    if (((window.innerHeight + window.scrollY) >= document.body.scrollHeight) && foundAll == false) {
        // you're at the bottom of the page
        var url_imgs = '/more_imgs/' + id + "/"+ page;
        // $(".loading_svg").show();
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
                    // $('.project-root__gallery').clone().appendTo(res['html']);
                    // $('.project-root__gallery').append(res['html']);
                    // $('.project-root__gallery').hide();
                    // $('.project-root__gallery').show();
                    page = page + 1;
                }
            },
            error: function() {
                alert("Ajax not successful");
            }
        });
        // $(".loading_svg").hide();
    }
};