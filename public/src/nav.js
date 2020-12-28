var clicked = false;
var link = window.location.href.split("/")

if(link[link.length - 1] == "#service-div") {
    $('html,body').animate({
        scrollTop: $("#service-div").offset().top},
        'slow');
} else if(link[link.length - 1] == "#gallery_id") {
    $('html,body').animate({
        scrollTop: $("#gallery_id").offset().top},
        'slow');
}

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
    $('html,body').animate({
        scrollTop: $("#" + div).offset().top},
        'slow');
}