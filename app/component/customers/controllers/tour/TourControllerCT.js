travel_app.controller('TourController', function ($scope, $location, $anchorScroll, TourServiceCT) {
    $anchorScroll();

    $scope.currentPage = 0;
    $scope.pageSize = 9;

    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    $scope.init = function () {
        $scope.isLoading = true;

        TourServiceCT.findAllTourDetailCustomer($scope.currentPage, $scope.pageSize).then(function (response) {
            if (response.status === 200) {
                $scope.tourDetail = response.data.data.content;
                $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                $scope.totalElements = response.data.data.totalElements;

                angular.forEach($scope.tourDetail, function (detail) {
                    let departureDate = new Date(detail.departureDate);
                    let arrivalDate = new Date(detail.arrivalDate);

                    detail.numberOfDays = Math.ceil((arrivalDate - departureDate) / (1000 * 60 * 60 * 24));
                });
            } else {
                $location.path('/admin/page-not-found')
            }
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    }

    /**
     * Phân trang
     */
    $scope.setPage = function (page) {
        if (page >= 0 && page < $scope.totalPages) {
            $scope.currentPage = page;
            $scope.init();
        }
    };

    $scope.getPaginationRange = function () {
        const range = [];
        let start, end;

        if ($scope.totalPages <= 3) {
            start = 0;
            end = $scope.totalPages;
        } else {
            start = Math.max(0, $scope.currentPage - 1);
            end = Math.min(start + 3, $scope.totalPages);

            if (end === $scope.totalPages) {
                start = $scope.totalPages - 3;
            }
        }

        for (let i = start; i < end; i++) {
            range.push(i);
        }

        return range;
    };

    $scope.pageSizeChanged = function () {
        $scope.currentPage = 0;
        $scope.init();
    };

    $scope.init();

    $scope.$on('$routeChangeSuccess', function () {
        $('.slider-active-5-item').slick({
            dots: false,
            arrows: false,
            infinite: true,
            speed: 800,
            autoplay: true,
            slidesToShow: 5,
            slidesToScroll: 1,
            prevArrow: '<div class="prev"><i class="far fa-arrow-left"></i></div>',
            nextArrow: '<div class="next"><i class="far fa-arrow-right"></i></div>',
            responsive: [{
                breakpoint: 1400, settings: {
                    slidesToShow: 4
                }
            }, {
                breakpoint: 1199, settings: {
                    slidesToShow: 3
                }
            }, {
                breakpoint: 991, settings: {
                    slidesToShow: 2
                }
            }, {
                breakpoint: 575, settings: {
                    slidesToShow: 1
                }
            }]
        });
    });
});