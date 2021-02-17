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
                console.log(response);
            },
            error: function() {
                alert("Ajax not successful");
            }
        });   
    } 
    else {
        alert("Passwords don't match!");
    } 
});