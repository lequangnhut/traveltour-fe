travel_app.directive('owlCarousel', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            function initCarousel() {
                $(element).owlCarousel({
                    items: 1,
                    loop: true,
                    autoplay: true,
                    autoplayTimeout: 3000,
                    autoplayHoverPause: true,
                    nav: true,
                    dots: true,
                    animateOut: 'fadeOut',
                    navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>']
                });
            }

            function destroyCarousel() {
                var owlInstance = $(element).data('owl.carousel');
                if (owlInstance) {
                    owlInstance.destroy();
                }
            }

            $timeout(function() {
                $('#infoRoomType').on('shown.bs.modal', function() {
                    initCarousel();
                });

                $('#infoRoomType').on('hidden.bs.modal', function() {
                    destroyCarousel();
                });
            }, 1500);

            scope.$on('$destroy', function() {
                destroyCarousel();
            });
        }
    };
});
