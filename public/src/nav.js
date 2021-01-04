var clicked = false;

$(".navigation__button").click(function () {
    if (!clicked) {
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        
        if (vw > 751) {
            $('.navigation__block').width("35rem");
        }
        else {
            $('.navigation__block').width("100%");
        }
        
        $('.navigation__block__list').css('transition', 'opacity 0.3s .45s, visibility 0.3s .45s');
        $('.navigation__block__list').css('visibility', 'visible');
        $('.navigation__block__list').css('opacity', '1');
        clicked = true;
    }
    else {
        $('.navigation__block').width("0rem");
        $('.navigation__block__list').css('visibility', 'hidden');
        $('.navigation__block__list').css('opacity', '0');
        $('.navigation__block__list').css('transition', 'opacity 0.1s, visibility 0.1s');
        clicked = false;
    }
});

function closeNav(div) {
    $('.navigation__button').trigger("click");
    var link = window.location.href.split("/");

    if(div.length > 0 && link[link.length - 1] != "contact" && link[link.length - 1] != "login" && link[link.length - 1] != "request" && link[link.length - 1] != "upload") {
        $('html,body').animate({
            scrollTop: $("#" + div).offset().top},
            'slow');
    }
}