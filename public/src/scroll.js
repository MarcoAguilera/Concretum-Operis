$( document ).ready(function () {
    var link = window.location.href.split("/")
    var w = window.screen.width;

    if(link[link.length - 1] == "#service-div") {

        if (w > 750) {
            $('html,body').delay(1000).animate({
                scrollTop: $("#service-div").offset().top},
                'slow');
        }

        else {
            $('html,body').delay(1000).animate({
                scrollTop: $("#service-div").offset().top - 50},
                'slow');
        }
    }
    if(link[link.length - 1] == "#about-div") {
        if (w > 750) {
            $('html,body').delay(1000).animate({
                scrollTop: $("#about-div").offset().top},
                'slow');
        }

        else {
            $('html,body').delay(1000).animate({
                scrollTop: $("#about-div").offset().top - 50},
                'slow');
        }
    } 
 });