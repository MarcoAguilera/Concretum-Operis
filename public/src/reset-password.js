$('.reset-password').on('submit', function(event) {
    event.preventDefault();
    
    var email = $('input[name="userEmail"]').val();

    $.ajax({
        async: true,
        url: "/verify-email",
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({email: email}),
        success: function(response) {
            console.log(response);
        }
    });    
});