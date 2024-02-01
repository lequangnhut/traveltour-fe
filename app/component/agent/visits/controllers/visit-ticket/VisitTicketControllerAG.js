travel_app.controller('VisitControllerAG', function ($scope, $timeout, $sce, $location, $routeParams, LocalStorageService, VisitLocationTicketServiceAG) {
    let searchTimeout;
    let visitTicketId = $routeParams.id;
    let brandId = LocalStorageService.get('brandId');

    $scope.isLoading = true;

    $scope.currentPage = 0;
    $scope.pageSize = 5;

    $scope.visitLocations = {};

    $scope.visitTicket = {
        id: null,
        visitLocationId: null,
        ticketTypeName: null,
        unitPrice: null
    }

    function errorCallback() {
        $location.path('/admin/internal-server-error');
    }

    $scope.init = function () {
        VisitLocationTicketServiceAG.findAllVisitTicket(brandId, $scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir).then(function successCallback(response) {
            if (response.status === 200) {
                $scope.visitTicketData = response.data.content;
                $scope.totalPages = Math.ceil(response.data.totalElements / $scope.pageSize);
                $scope.totalElements = response.data.totalElements;

                response.data.content.forEach(visitLocations => {
                    $scope.findVisitLocationName(visitLocations.visitLocationId);
                });
            }
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });

        /**
         * Tìm kiếm
         */
        $scope.searchVisitTicket = function () {
            if (searchTimeout) $timeout.cancel(searchTimeout);

            searchTimeout = $timeout(function () {
                VisitLocationTicketServiceAG.findAllVisitTicket(brandId, $scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.searchTerm)
                    .then(function (response) {
                        $scope.visitTicketData = response.data.content;
                        $scope.totalPages = Math.ceil(response.data.totalElements / $scope.pageSize);
                        $scope.totalElements = response.data.totalElements;
                    }, errorCallback).finally(function () {
                    $scope.isLoading = false;
                });
            }, 500);
        };

        /**
         * Tìm visitLocation bằng visitLocationId
         * @param visitLocationId
         */
        $scope.findVisitLocationName = function (visitLocationId) {
            if (!$scope.visitLocations[visitLocationId]) {
                VisitLocationTicketServiceAG.findByVisitLocationId(visitLocationId).then(function (response) {
                    if (response.status === 200) {
                        $scope.visitLocationSelect = response.data.data;
                        let visitLocation = $scope.visitLocations[visitLocationId] = response.data.data;

                        for (let i = 0; i < visitLocation.length; i++) {
                            $scope.visitLocations = visitLocation[i];
                        }
                    } else {
                        $location.path('/admin/page-not-found');
                    }
                }, errorCallback);
            }
        };

        /**
         * Tìm bằng visitTicketId để cập nhật
         */
        if (visitTicketId !== undefined && visitTicketId !== null && visitTicketId !== "") {
            VisitLocationTicketServiceAG.findByVisitTicketId(visitTicketId).then(function (response) {
                if (response.status === 200) {
                    $scope.visitTicket = response.data.data;
                } else {
                    $location.path('/admin/page-not-found');
                }
            }, errorCallback);
        }
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

    $scope.getDisplayRange = function () {
        return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
    };

    /**
     * Sắp xếp
     */
    $scope.sortData = function (column) {
        $scope.sortBy = column;
        $scope.sortDir = ($scope.sortDir === 'asc') ? 'desc' : 'asc';
        $scope.init();
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

    $scope.createVisitTicket = function () {
        $scope.isLoading = true;
        let dataTicket = $scope.visitTicket;

        VisitLocationTicketServiceAG.create(dataTicket).then(function () {
            toastAlert('success', 'Tạo vé tham quan thành công !');
            $location.path('/business/visit/visit-ticket-management');
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    };

    $scope.updateVisitTicket = function () {
        let dataTicket = $scope.visitTicket;

        function confirmUpdate() {
            $scope.isLoading = true;

            VisitLocationTicketServiceAG.update(dataTicket).then(function () {
                toastAlert('success', 'Cập nhật thành công !');
                $location.path('/business/visit/visit-ticket-management');
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        confirmAlert('Bạn có chắc chắn muốn xóa vé tham quan không ?', confirmUpdate);
    };

    $scope.deleteVisitTicket = function (visitTicketId, locationName) {

        function confirmDelete() {
            $scope.isLoading = true;

            VisitLocationTicketServiceAG.delete(visitTicketId).then(function () {
                toastAlert('success', 'Xóa vé tham quan thành công !');
                $location.path('/business/visit/visit-ticket-management');
                $scope.init();
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        confirmAlert('Bạn có chắc chắn muốn xóa vé tham quan ' + locationName + ' không ?', confirmDelete);
    };

    $scope.init();
});