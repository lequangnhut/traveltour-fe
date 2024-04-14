travel_app.controller('BookingControllerAD',
    function ($scope, $sce, $q, $location, $routeParams, $timeout, BookingTourServiceAD, TourDetailsServiceAD) {
        $scope.isLoading = true;

        let searchTimeout;

        $scope.bookingTourList = [];
        $scope.currentPage = 0;
        $scope.pageSize = 5;
        $scope.currentTab = 'pending';
        $scope.orderStatus = 0;

        function errorCallback() {
            $location.path('/admin/internal-server-error')
        }

        $scope.changeTab = (tab, status) => {
            $scope.currentTab = tab;
            $scope.orderStatus = status;
            $scope.getTourBookingList();
        };

        //phân trang
        $scope.setPage = function (page) {
            if (page >= 0 && page < $scope.totalPages) {
                $scope.currentPage = page;
                $scope.getTourBookingList();
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
            $scope.getTourBookingList();
        };

        $scope.getDisplayRange = () => {
            return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
        };

        const bookingTourData = (response) => {
            $scope.bookingTourList = response.data.data !== null ? response.data.data.content : [];
            $scope.totalPages = response.data.data !== null ? Math.ceil(response.data.data.totalElements / $scope.pageSize) : 0;
            $scope.totalElements = response.data.data !== null ? response.data.data.totalElements : 0;

            const promises = $scope.bookingTourList.map((booking) => {
                return TourDetailsServiceAD.findTourDetailById(booking.tourDetailId).then((response) => {
                    booking.tourDetailsByTourDetailId = response.data.data;
                    return booking;
                });
            });

            $q.all(promises).then((updatedBookings) => {
            }).catch((error) => {
                console.error("Error occurred: ", error);
            });
        };


        $scope.getTourBookingList = function () {
            BookingTourServiceAD.getAll($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.orderStatus)
                .then((response) => {
                    bookingTourData(response)
                }, errorCallback).finally(() => {
                $scope.isLoading = false;
            });
        };


        //sắp xếp
        $scope.sortData = (column) => {
            $scope.sortBy = column;
            $scope.sortDir = ($scope.sortDir === 'asc') ? 'desc' : 'asc';
            $scope.getTourBookingList();
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
            $scope.setPage(0);

            searchTimeout = $timeout(() => {
                BookingTourServiceAD.getAll($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.orderStatus, $scope.searchTerm)
                    .then((response) => {
                        bookingTourData(response)
                    }, errorCallback);
            }, 500); // 500ms debounce
        };

        $scope.browseBookingTour = (id) => {
            const confirm = () => {
                BookingTourServiceAD.updateStatus(id).then(() => {
                    toastAlert('success', 'Duyệt thành công !');
                    $('#modal-tour-detail').modal('hide');
                    $scope.changeTab('paid', 1);
                    $scope.getTourBookingList();
                }, errorCallback);
            }

            confirmAlert('Bạn có chắc chắn muốn duyệt booking này không ?', confirm);
        }

        $scope.deleteBookingTour = (id) => {
            const confirm = () => {
                BookingTourServiceAD.deactivate(id).then(() => {
                    toastAlert('success', 'Hủy thành công !');
                    $('#modal-tour-detail').modal('hide');
                    $scope.changeTab('cancelled', 2)
                    $scope.getTourBookingList();
                }, errorCallback);
            }

            confirmAlert('Bạn có chắc chắn muốn hủy booking này không ?', confirm);
        }

        $scope.getTourBookingList();

        /**
         * Phương thức mở modal
         */
        $scope.openModal = (data) => {
            $('#modal-tour-detail').modal('show');
            $scope.bookingTour = data;
        }

        $scope.openModalCancelTransaction = (data) => {
            $('#modal-cancel-transaction').modal('show');
            $scope.bookingTour = data;
        }

        /**
         * Phương thức đóng modal
         */
        $scope.closeModal = () => {
            $('#modal-tour-detail').modal('hide');
        };
        $scope.closeModal = () => {
            $('#modal-cancel-transaction').modal('hide');
        };

    });
