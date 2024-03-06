travel_app.controller('AccommodationInformationControllerAD',
    function ($scope, $sce, $location, $routeParams, $timeout, AccommodationInformationServiceAD) {
        $scope.isLoading = true;

        let searchTimeout;

        $scope.bookingTourList = [];
        $scope.currentPage = 0;
        $scope.pageSize = 5;

        function errorCallback() {
            $location.path('/admin/internal-server-error')
        }


        //phân trang
        $scope.setPage = function (page) {
            if (page >= 0 && page < $scope.totalPages) {
                $scope.currentPage = page;
                $scope.getTourBookingList();
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
            $scope.getTourBookingList();
        };

        $scope.getDisplayRange = function () {
            return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
        };

        $scope.getTourBookingList = function () {
            AccommodationInformationServiceAD.getAll($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir)
                .then(function (response) {
                    if (response.data.data === null || response.data.data.content.length === 0) {
                        $scope.setPage(Math.max(0, $scope.currentPage - 1));
                        return
                    }
                    $scope.bookingTourList = response.data.data.content;
                    $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                    $scope.totalElements = response.data.data.totalElements;

                    console.log($scope.bookingTourList)
                }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        };

        //sắp xếp
        $scope.sortData = function (column) {
            $scope.sortBy = column;
            $scope.sortDir = ($scope.sortDir === 'asc') ? 'desc' : 'asc';
            $scope.getTourBookingList();
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


        //tìm kiếm
        $scope.searchBookingTour = function () {
            if (searchTimeout) $timeout.cancel(searchTimeout);

            searchTimeout = $timeout(function () {
                AccommodationInformationServiceAD.getAll($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.searchTerm)
                    .then(function (response) {
                        $scope.bookingTourList = response.data.data.content;
                        $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                        $scope.totalElements = response.data.data.totalElements;
                    }, errorCallback);
            }, 500); // 500ms debounce
        };

        $scope.deleteBookingTour = function (id) {
            function confirm() {
                AccommodationInformationServiceAD.deactivate(id).then(function successCallback() {
                    toastAlert('success', 'Hủy thành công !');
                    $('#modal-tour-detail').modal('hide');
                    $scope.getTourBookingList();
                }, errorCallback);
            }

            confirmAlert('Bạn có chắc chắn muốn hủy booking này không ?', confirm);
        }

        $scope.getTourBookingList();

        /**
         * Phương thức mở modal
         */
        $scope.openModal = function (data) {
            $('#modal-tour-detail').modal('show');
            $scope.bookingTour = data;
        }

        /**
         * Phương thức đóng modal
         */
        $scope.closeModal = function () {
            $('#modal-tour-detail').modal('hide');
        };

    });
