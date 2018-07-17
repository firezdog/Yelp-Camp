// This is probably very insecure...

$(document).ready(function(){
    $("form").submit(function(e){
        const password = $("#password").val();
        const confirmation = $("#confirmation").val();
        if (password !== confirmation) {
            e.preventDefault();
            $("#confirmation-error").text("Password and confirmation do not match.");
        }
    });
});