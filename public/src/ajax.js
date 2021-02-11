$('.contact-popup__form').on('submit', function(event) {
    event.preventDefault();
    
    var name = $('input[name="contactPopupName"]').val();
    var phone = $('input[name="contactPopupNumber"]').val();

    $.ajax({
        async: true,
        url: "/",
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({name: name, phone: phone}),
        success: function(response) {
            console.log(response);
            $('input[name="contactPopupName"]').val("");
            $('input[name="contactPopupNumber"]').val("");
        }
    });    

    $('.contact-popup__info').hide("500");
    
    setTimeout(function(){
        $('#postText').show(500);
    }, 400);
    setTimeout(function(){
        $('#postGif').show(500);
    }, 1000);

    setTimeout(function(){
        $('.contact-popup__close').trigger("click");
    }, 10000);
});