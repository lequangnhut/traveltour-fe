travel_app.controller('HomeCusController', function ($scope, $window, $location, LocalStorageService, HomeCusService, AuthService, NotificationService) {
    $scope.currentPage = 0;
    $scope.pageSize = 10;

    $scope.filters = {
        departureArrives: null,
        departureFrom: null,
        numberOfPeople: 2,
        departure: new Date()
    }

    $scope.showArrivesList = false;
    $scope.showFromList = false;

    $scope.enableIncomingList = function () {
        $scope.showArrivesList = true;
    };

    $scope.turnOnThePointList = function () {
        $scope.showFromList = true;
    };
    $scope.turnOffThePointList = function () {
        $scope.showFromList = false;
    };

    $scope.setSelectedTour = function (tour) {
        $scope.filters.departureArrives = tour.tourName;
        $scope.showArrivesList = false;
    };

    angular.element(document).on('click', function (event) {
        const target = angular.element(event.target);
        const isInput = target.is('input');
        const isListItem = target.parents('.list-group').length > 0;
        if (!isInput && !isListItem) {
            $scope.$apply(function () {
                $scope.showArrivesList = false;
                $scope.showFromList = false;
            });
        }
    });

    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    $scope.init = function () {
        $scope.isLoading = true;

        HomeCusService.findAllTourDetailCustomer($scope.currentPage, $scope.pageSize).then(function (response) {
            if (response.status === 200) {
                $scope.tourDetail = response.data.data.content;

                $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                $scope.totalElements = response.data.data.totalElements;
            } else {
                $location.path('/admin/page-not-found')
            }
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });

        AuthService.userLoginGoogle().then(function (response) {
            if (response.status === 200) {
                let user = response.data.data;
                if (user !== null) {
                    let roles = response.data.data.roles;
                    for (let i = 0; i < roles.length; i++) {
                        if (roles[i].nameRole !== 'ROLE_CUSTOMER') {
                            toastAlert('warning', 'Không đủ quyền truy cập !');
                        } else {
                            AuthService.setAuthData('eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuaHV0LnRoYW50aGllbjE3QGdtYWlsLmNvbSIsInJvbGVzIjpbIlJPTEVfQ1VTVE9NRVIiXSwiaWF0IjoxNzEwMjg2NDMzLCJleHAiOjE3MTAzMjI0MzN9.WlVSDbXUTzhszu_K8KOzsAMikSb7tzMCSg3Qu0JvXpI', user);
                            $window.location.href = '/home';
                            NotificationService.setNotification('success', 'Đăng nhập thành công !');
                        }
                    }
                }
            }
        }, errorCallback);

        function removeDiacritics(str) {
            return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }

        HomeCusService.getAllDataList($scope.filters.departureArrives, $scope.filters.departureFrom).then((response) => {
            if (response.status === 200) {
                const departureArrives = response.data.data.departureArrives;
                const departureFrom = response.data.data.departureFrom;

                const updateArrivesLists = (newVal) => {
                    let filteredArrives = [];

                    if (newVal && newVal.trim() !== '') {
                        const searchTermWithoutDiacritics = removeDiacritics(newVal.toLowerCase());

                        filteredArrives = departureArrives.filter(function (arrive) {
                            const arriveWithoutDiacritics = removeDiacritics(arrive.tourName.toLowerCase());
                            return arriveWithoutDiacritics.includes(searchTermWithoutDiacritics) || arriveWithoutDiacritics.includes(newVal.toLowerCase());
                        });

                        if (filteredArrives.length < 10) {
                            const additionalFilteredArrives = departureArrives.filter(function (arrive) {
                                const arriveWithoutDiacritics = removeDiacritics(arrive.toLocation.toLowerCase());
                                return !filteredArrives.includes(arrive) && (arriveWithoutDiacritics.includes(searchTermWithoutDiacritics) || arriveWithoutDiacritics.includes(newVal.toLowerCase()));
                            });
                            filteredArrives.push(...additionalFilteredArrives);
                        }
                    } else {
                        filteredArrives = angular.copy(departureArrives);
                    }
                    $scope.departureArrives = filteredArrives.slice(0, 10);
                };

                const updateFromLists = (newVal) => {
                    let filteredFrom = [];

                    if (newVal && newVal.trim() !== '') {
                        const searchTermWithoutDiacritics = removeDiacritics(newVal.toLowerCase());

                        filteredFrom = departureFrom.filter(function (from) {
                            const fromWithoutDiacritics = removeDiacritics(from.toLowerCase());
                            return fromWithoutDiacritics.includes(searchTermWithoutDiacritics) || fromWithoutDiacritics.includes(newVal.toLowerCase());
                        });
                    } else {
                        filteredFrom = angular.copy(departureFrom);
                    }
                    $scope.departureFrom = filteredFrom;
                };

                $scope.$watch('filters.departureArrives', updateArrivesLists);
                $scope.$watch('filters.departureFrom', updateFromLists);

                updateArrivesLists();
                updateFromLists();

            } else {
                $location.path('/admin/page-not-found')
            }
        }, errorCallback);

    }

    $scope.getCurrentDate = () => {
        let currentDate = new Date();
        const year = currentDate.getFullYear();
        let month = currentDate.getMonth() + 1;
        let day = currentDate.getDate();

        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }

        return year + '-' + month + '-' + day;
    };

    $scope.onQuantityChange = (filters) => {
        filters.numberOfPeople = parseInt(filters.numberOfPeople, 10) || 0;
        if (filters.numberOfPeople > 999) {
            filters.numberOfPeople = 999;
        }
    };

    $scope.onQuantityBlur = (filters) => {
        if (filters.numberOfPeople === null || filters.numberOfPeople === '' || filters.numberOfPeople < 1) {
            filters.numberOfPeople = 1;
        }
    };

    $scope.filterAllTour = () => {

        if ($scope.filters.departureArrives === null) {
            centerAlert('Thông báo !', 'Vui lòng nhập nơi muốn đến !', 'warning');
            return;
        } else if ($scope.filters.departure === undefined) {
            centerAlert('Thông báo !', 'Không được nhập ngày quá khứ!', 'warning');
            return;
        }
        LocalStorageService.encryptLocalData($scope.filters, 'filtersTour', 'encryptFiltersTour');
        $location.path('/tours');
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
        $('.slider-active-3-item').slick({
            dots: false,
            arrows: false,
            infinite: true,
            speed: 800,
            autoplay: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            prevArrow: '<div class="prev"><i class="far fa-angle-left"></i></div>',
            nextArrow: '<div class="next"><i class="far fa-angle-right"></i></div>',
            responsive: [{
                breakpoint: 1200, settings: {
                    slidesToShow: 2
                }
            }, {
                breakpoint: 991, settings: {
                    slidesToShow: 2
                }
            }, {
                breakpoint: 800, settings: {
                    slidesToShow: 1
                }
            }]
        });
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