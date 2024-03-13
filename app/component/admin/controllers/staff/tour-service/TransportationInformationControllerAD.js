travel_app.controller('TransportationInformationControllerAD', function ($scope, $sce, $location, $routeParams, $timeout, TransportationInformationServiceAD, TourDetailsServiceAD) {
    $scope.isLoading = true;

    let searchTimeout;

    $scope.bookingTourTransportationSchedulesList = [];
    $scope.currentPage = 0;
    $scope.pageSize = 5;

    const errorCallback = () => {
        $location.path('/admin/internal-server-error')
    }

    //phân trang
    $scope.setPage = (page) => {
        if (page >= 0 && page < $scope.totalPages) {
            $scope.currentPage = page;
            $scope.getBookingTourTransportationSchedulesList();
        }
    };

    $scope.getPaginationRange = () => {
        let range = [];
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

    $scope.pageSizeChanged = () => {
        $scope.currentPage = 0;
        $scope.getBookingTourTransportationSchedulesList();
    };

    $scope.getDisplayRange = () => {
        return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
    };

    $scope.bookingTourTransportationSchedulesData = (response) => {
        $scope.bookingTourTransportationSchedulesList = response.data.data !== null ? response.data.data.content : [];
        $scope.totalPages = response.data.data !== null ? Math.ceil(response.data.data.totalElements / $scope.pageSize) : 0;
        $scope.totalElements = response.data.data !== null ? response.data.data.totalElements : 0;
    };

    $scope.getBookingTourTransportationSchedulesList = () => {
        $scope.isLoading = true;
        TransportationInformationServiceAD.getAllByInfo($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.tourDetailId, $scope.orderStatus, $scope.searchTerm)
            .then((response) => {
                $scope.bookingTourTransportationSchedulesData(response)
            }, errorCallback).finally(() => {
            $scope.isLoading = false;
        });
    };

    //sắp xếp
    $scope.sortData = (column) => {
        $scope.sortBy = column;
        $scope.sortDir = ($scope.sortDir === 'asc') ? 'desc' : 'asc';
        $scope.getBookingTourTransportationSchedulesList();
    };

    $scope.getSortIcon = (column) => {
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
    $scope.searchBookingTour = () => {
        if (searchTimeout) $timeout.cancel(searchTimeout);

        searchTimeout = $timeout(() => {
            TransportationInformationServiceAD.getAllByInfo($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.tourDetailId, $scope.orderStatus, $scope.searchTerm)
                .then((response) => {
                    $scope.bookingTourTransportationSchedulesData(response)
                }, errorCallback);
        }, 500);
    };

    $scope.orderTransportationSchedulesChanged = () => {
        $scope.getBookingTourTransportationSchedulesList();
    };

    $scope.deactivateBookingTourTransportationSchedules = (transportationScheduleId) => {
        const confirm = () => {
            TransportationInformationServiceAD.deactivate(transportationScheduleId).then(() => {
                toastAlert('success', 'Hủy thành công !');
                $('#modal-order-transportation-schedule').modal('hide');
                $scope.getBookingTourTransportationSchedulesList();
            }, errorCallback);
        }

        confirmAlert('Bạn có chắc chắn muốn hủy đơn này không ?', confirm);
    }

    $scope.restoreBookingTourTransportationSchedules = (transportationScheduleId) => {
        const confirm = () => {
            TransportationInformationServiceAD.restore(transportationScheduleId).then((repo) => {
                toastAlert('success', 'Khôi phục thành công !');
                $('#modal-order-transportation-schedule').modal('hide');
                $scope.getBookingTourTransportationSchedulesList();
            }, errorCallback);
        }

        confirmAlert('Bạn có chắc chắn muốn khôi phục đơn này không ?', confirm);
    }

    $scope.getBookingTourTransportationSchedulesList();

    /**
     * Phương thức mở modal
     */
    $scope.openModal = (data) => {
        $('#modal-order-transportation-schedule').modal('show');
        $scope.transportationSchedule = data;
        $scope.tourGuide = data.orderTransportationsById[0];
    }

    $scope.openModalPay = () => {
        $scope.closeModal()
        $('#modal-pay').modal('show');
    }

    /**
     * Phương thức đóng modal
     */
    $scope.closeModal = () => {
        $('#modal-order-transportation-schedule').modal('hide');
    };

    $scope.closeModalPay = () => {
        $('#modal-pay').modal('hide');
    };

    $scope.selectTourDetailId = () => {
        $scope.isLoading = true;
        TourDetailsServiceAD.findAllTourDetails().then((response) => {
            $scope.tourDetails = response.data.data.content
        }, errorCallback).finally(() => {
            $scope.isLoading = false;
        });
    }

    $scope.selectTourDetailId()

});
