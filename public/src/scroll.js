$( document ).ready(function () {
    var link = window.location.href.split("/")

    if(link[link.length - 1] == "#service-div") {
        $('html,body').delay(1000).animate({
            scrollTop: $("#service-div").offset().top},
            'slow');
    }
    if(link[link.length - 1] == "#about-div") {
        $('html,body').delay(1000).animate({
            scrollTop: $("#about-div").offset().top},
            'slow');
    } 
    if(link[link.length - 1] == "#gallery_id") {
        $('html,body').delay(1000).animate({
            scrollTop: $("#gallery_id").offset().top},
            'slow');
    }

 });