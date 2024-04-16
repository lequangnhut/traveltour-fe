travel_app.directive('owlCarousel', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            function initCarousel() {
                $(element).owlCarousel({
                    items: 1,
                    loop: true,
                    autoplay: true,
                    autoplayTimeout: 3000,
                    autoplayHoverPause: true,
                    nav: true,
                    navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>']
                });
            }

            function destroyCarousel() {
                var owlInstance = $(element).data('owl.carousel');
                if (owlInstance) {
                    owlInstance.destroy();
                }
            }

            $timeout(function () {
                $('#infoRoomType').on('shown.bs.modal', function () {
                    initCarousel();
                });

                $('#infoRoomType').on('hidden.bs.modal', function () {
                    destroyCarousel();
                });
            }, 1500);

            scope.$on('$destroy', function () {
                destroyCarousel();
            });
        }
    };
});

// travel_app.directive('swiper', ['$timeout', function($timeout) {
//     return {
//         restrict: 'A',
//         link: function(scope, element, attrs) {
//             $timeout(function() {
//                 var swiper = new Swiper(element[0], {
//                     // Các tùy chọn Swiper
//                     slidesPerView: 1,
//                     loop: true,
//                     navigation: {
//                         nextEl: '.swiper-button-next',
//                         prevEl: '.swiper-button-prev',
//                     },
//                     pagination: {
//                         el: '.swiper-pagination',
//                         clickable: true,
//                     },
//                 });
//             }, 1000);
//         }
//     };
// }]);



