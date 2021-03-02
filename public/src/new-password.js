function redirectLogin() {
    // window.location="http://localhost:3000/login";
    window.location="http://www.concretumoperis.com/login"
}

function fiveSecRedirect() {
    setTimeout('redirectLogin()', 5000);
}

$('.new_password__form').on('submit', function(event) {
    event.preventDefault();
    
    var pass = $('input[name="newPassword"]').val();
    var cp_pass = $('input[name="copyPassword"]').val();
    var id = $('input[name="id"]').val();

    if (pass === cp_pass) {
        $.ajax({
            async: true,
            url: "/new-password/" + id,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({password: pass}),
            success: function(response) {
                if (response == "Success") {
                    $('.new_password').css('display', 'none');
                    $('.new_password__success').css('display', 'flex');
                    setTimeout('redirectLogin()', 10000);
                }   
                else {
                    alert(response);
                }
            },
            error: function() {
                alert("Ajax not successful");
                redirectLogin();
            }
        });   
    } 
    else {
        alert("Passwords don't match!");
    } 
});