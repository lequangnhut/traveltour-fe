travel_app.controller('GuideController',
    function ($scope, $http, $location, $sce, $rootScope, $routeParams, $timeout, LocalStorageService, AuthService, GuideService) {

        $scope.showActivities = false;

        $scope.isLoading = true;

        let searchTimeout;

        $scope.guideId = AuthService.getUser().id;

        $scope.tourList = [];
        $scope.tourTripList = [];
        $scope.tourCustomerList = [];
        $scope.destinationList = [];
        $scope.tourHotelList = [];
        $scope.tourTransList = [];
        $scope.tourVisitList = [];

        $scope.currentPage = 0;
        $scope.pageSize = 6;
        $scope.currentTab = 'pending';
        $scope.isAccepted = true;

        $scope.tourStatus = 1;


        const errorCallback = () => {
            $location.path('/admin/internal-server-error')
        }

        $scope.toggleActivities = () => {
            $scope.showActivities = !$scope.showActivities;
        };

        $scope.getNavItem = LocalStorageService.get('activeNavItem');
        if ($scope.getNavItem === 'guide-future') {
            $scope.tourStatus = 1;
        } else if ($scope.getNavItem === 'guide-continuos') {
            $scope.tourStatus = 2;
        } else if ($scope.getNavItem === 'guide-perfect') {
            $scope.tourStatus = 3;
        } else if ($scope.getNavItem === 'guide-cancel') {
            $scope.tourStatus = 4;
        }

        $scope.exportPdf = function () {
            // Sử dụng $timeout để chờ cho đến khi phần tử cuộn hoàn toàn
            $timeout(function () {
                const element = document.querySelector('.export-file'); // Chọn phần tử chứa nội dung cần xuất PDF
                const options = {
                    margin: 0.4,
                    image: {type: 'jpeg', quality: 0.20},
                    html2canvas: {scale: 2, useCORS: false},
                    jsPDF: {
                        unit: 'in',
                        format: 'letter',
                        orientation: 'portrait'
                    }
                };
                html2pdf().set(options)
                    .from(element)
                    .save('document.pdf'); // Lưu file PDF với tên 'document.pdf'
            }, 1000); // Chờ 1 giây trước khi xuất PDF, có thể điều chỉnh thời gian theo nhu cầu của bạn
        };

        $scope.exportCustomerPdf = function () {
            // Sử dụng $timeout để chờ cho đến khi phần tử cuộn hoàn toàn
            $timeout(function () {
                const element = document.querySelector('.customer-list'); // Chọn phần tử chứa nội dung cần xuất PDF
                const options = {
                    margin: 0.4,
                    image: {type: 'jpeg', quality: 0.20},
                    html2canvas: {scale: 2, useCORS: false},
                    jsPDF: {
                        unit: 'in',
                        format: 'letter',
                        orientation: 'portrait'
                    }
                };
                html2pdf().set(options)
                    .from(element)
                    .save('document.pdf'); // Lưu file PDF với tên 'document.pdf'
            }, 1000); // Chờ 1 giây trước khi xuất PDF, có thể điều chỉnh thời gian theo nhu cầu của bạn
        };

        $scope.exportTripPdf = function () {
            // Sử dụng $timeout để chờ cho đến khi phần tử cuộn hoàn toàn
            $timeout(function () {
                const element = document.querySelector('.trip-pdf'); // Chọn phần tử chứa nội dung cần xuất PDF
                const options = {
                    margin: 0.4,
                    image: {type: 'jpeg', quality: 0.20},
                    html2canvas: {scale: 2, useCORS: false},
                    jsPDF: {
                        unit: 'in',
                        format: 'letter',
                        orientation: 'portrait'
                    }
                };
                html2pdf().set(options)
                    .from(element)
                    .save('document.pdf'); // Lưu file PDF với tên 'document.pdf'
            }, 1000); // Chờ 1 giây trước khi xuất PDF, có thể điều chỉnh thời gian theo nhu cầu của bạn
        };

        //phân trang
        $scope.setPage = function (page) {
            if (page >= 0 && page < $scope.totalPages) {
                $scope.currentPage = page;
                $scope.tourCancelList();
            }
        };

        $scope.getPaginationRange = function () {
            let range = [];
            let start, end;

            if ($scope.totalPages <= 3) {
                start = 0;
                end = $scope.totalPages;
            } else {
                // Hiển thị 2 trang trước và 2 trang sau trang hiện tại
                start = Math.max(0, $scope.currentPage - 1);
                end = Math.min(start + 3, $scope.totalPages);

                // Điều chỉnh để luôn hiển thị 5 trang
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
            $scope.tourCancelList();
        };

        $scope.getDisplayRange = function () {
            return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
        };

        $scope.sortData = function (column) {
            $scope.sortBy = column;
            $scope.sortDir = ($scope.sortDir === 'asc') ? 'desc' : 'asc';
            $scope.tourCancelList();
        };

        $scope.getSortIcon = function (column) {
            if ($scope.sortBy === column) {
                if ($scope.sortDir === 'asc') {
                    return $sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M182.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"/></svg>');
                } else {
                    return $sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z"/></svg>');
                }
            }
            return $sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z"/></svg>');
        };

        $scope.tourCancelList = function () {
            GuideService.findAllTour($scope.guideId, $scope.tourStatus, $scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.searchTerm)
                .then(function (response) {
                    if (response.data.data === null || response.data.data.content.length === 0) {
                        $scope.tourList.length = 0;
                        $scope.totalElements = 0;
                        return;
                    }
                    $scope.tourList = response.data.data.content;
                    $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                    $scope.totalElements = response.data.data.totalElements;
                }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        };

        $scope.tourCancelList();

        $scope.searchName = function () {
            if (searchTimeout) $timeout.cancel(searchTimeout);

            searchTimeout = $timeout(function () {
                GuideService.findAllTour($scope.guideId, $scope.tourStatus, $scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.searchTerm)
                    .then(function (response) {
                        if (response.data.data === null || response.data.data.content.length === 0) {
                            $scope.tourList.length = 0;
                            $scope.totalElements = 0;
                            return;
                        }
                        $scope.tourList = response.data.data.content;
                        $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                        $scope.totalElements = response.data.data.totalElements;
                    }, errorCallback).finally(function () {
                    $scope.isLoading = false;
                });
            }, 500);
        };

        $scope.openTourGuideModal = function (data) {
            $('#tourModal').modal('show');
            $scope.modalInfo = data;
            $scope.tourTripList = data.tourTripsById;
            $scope.destinationList = data.tourDestinationsById;
            GuideService.findInfoById(data.toursByTourId.id, data.id)
                .then(function (response) {
                    $scope.typeName = response.data.data.toursDto.tourTypesByTourTypeId.tourTypeName;
                    $scope.customerList = response.data.data.bookingCustomerList;
                }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
            var currentDate = new Date();
            var departureDate = new Date(data.departureDate);
            var arrivalDate = new Date(data.arrivalDate);
            var daysElapsed = Math.ceil((currentDate - departureDate) / (1000 * 60 * 60 * 24));
            var totalDays = Math.ceil((arrivalDate - departureDate) / (1000 * 60 * 60 * 24));
            var progressPercentage = Math.ceil((daysElapsed / totalDays) * 100);
            var total = 0;
            if (progressPercentage <= 0) {
                total = 0;
            } else if (progressPercentage > 0 && progressPercentage <= 100) {
                total = progressPercentage;
            } else {
                total = 100;
            }
            $scope.progressIndex = total;
            $scope.locationDetailDescription = $sce.trustAsHtml($scope.modalInfo.tourDetailDescription);
        }

        $scope.closeTourGuideModal = function () {
            $('#tourModal').modal('hide');
        };

    });