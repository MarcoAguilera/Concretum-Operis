function redirectHome() {
    // window.location="http://localhost:3000/login";
    window.location="http://www.concretumoperis.com/login";
}

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
            if(response == "Found User") {
                $('.reset-password').hide(); 
                $('.reset-password__sent').css('display', 'flex'); 

                setTimeout('redirectHome()', 10000);
            }
            else if(response == "Error Finding User") {
                alert("Error finding user");
            }
            else if(response == "No User Found") {
                alert("User not found");
            }
        }
    });    
});