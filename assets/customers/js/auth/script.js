(function ($) {
    "use strict";
    /*========== Loader start ================*/
    $(window).on('load', function () {
        $('#loader-wrapper').fadeIn();
        setTimeout(function () {
            $('#loader-wrapper').fadeOut();
        }, 200);
    });
    // Password input
    $(".toggle-password").on('click', function () {
        $(this).toggleClass("fa-eye fa-eye-slash");
        const input = $($(this).attr("data-toggle"));
        if (input.attr("type") === "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
    });
})(jQuery);