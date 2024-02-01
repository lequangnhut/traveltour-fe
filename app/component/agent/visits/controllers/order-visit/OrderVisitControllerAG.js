travel_app.controller('OrderVisitControllerAG', function ($scope, $timeout, $sce, $location, $routeParams, OrderVisitServiceAG, LocalStorageService) {
    let searchTimeout;
    let bookingVisitId = $routeParams.id;
    let brandId = LocalStorageService.get('brandId');

    $scope.isLoading = true;

    $scope.currentPage = 0;
    $scope.pageSize = 5;

    $scope.visitLocations = {};

    $scope.ticketTypes = {
        free: null,
        adult: null,
        child: null
    };

    $scope.unitPrice = {
        adult: null,
        child: null,
        freeQuantity: null,
        adultQuantity: null,
        childQuantity: null
    }

    $scope.orderVisit = {
        id: null,
        userId: null,
        visitLocationId: null,
        customerName: null,
        customerCitizenCard: null,
        customerPhone: null,
        customerEmail: null,
        capacityAdult: null,
        capacityKid: null,
        checkIn: null,
        orderTotal: null,
        paymentMethod: null,
        orderCode: null,
        dateCreated: null,
        orderStatus: null,
        orderNote: null,
    }

    function errorCallback() {
        $location.path('/admin/internal-server-error');
    }

    $scope.init = function () {
        OrderVisitServiceAG.findAllOrderVisit(brandId, $scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir).then(function successCallback(response) {
            if (response.status === 200) {
                $scope.orderVisitData = response.data.content;
                $scope.totalPages = Math.ceil(response.data.totalElements / $scope.pageSize);
                $scope.totalElements = response.data.totalElements;
            }
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });

        /**
         * Tìm kiếm
         */
        $scope.searchOrderVisit = function () {
            if (searchTimeout) $timeout.cancel(searchTimeout);

            searchTimeout = $timeout(function () {
                OrderVisitServiceAG.findAllOrderVisit(brandId, $scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.searchTerm)
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
         * Tìm visitLocation bằng brandId
         * @param brandId
         */
        OrderVisitServiceAG.findAllVisitLocation(brandId).then(function (response) {
            if (response.status === 200) {
                $scope.visitLocationSelect = response.data.data;
            } else {
                $location.path('/admin/page-not-found');
            }
        }, errorCallback);

        /**
         * Tìm bằng visitTicketId để cập nhật
         */
        if (bookingVisitId !== undefined && bookingVisitId !== null && bookingVisitId !== "") {

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

    $scope.createOrderVisit = function () {
        $scope.isLoading = true;
        let dataOrderVisit = $scope.orderVisit;
        const selectedTickets = [];
        const ticketDetails = {};

        if ($scope.ticketTypes.free) {
            selectedTickets.push("Miễn phí vé");
            ticketDetails.free = {
                quantity: 0,
                unitPrice: $scope.unitPrice.adult || 0
            };
        }
        if ($scope.ticketTypes.adult) {
            selectedTickets.push("Vé người lớn");
            ticketDetails.adult = {
                quantity: $scope.unitPrice.adultQuantity || 0,
                unitPrice: $scope.unitPrice.adult || 0
            };
        }
        if ($scope.ticketTypes.child) {
            selectedTickets.push("Vé trẻ em");
            ticketDetails.child = {
                quantity: $scope.unitPrice.childQuantity || 0,
                unitPrice: $scope.unitPrice.child || 0
            };
        }

        console.log("Data Order Visit:", dataOrderVisit);
        console.log("Selected Tickets:", selectedTickets);
        console.log("Ticket Details:", ticketDetails);

        // Rest of your code
        // OrderVisitServiceAG.create(dataOrderVisit).then(function () {
        //     toastAlert('success', 'Tạo booking thành công !');
        //     $location.path('/business/visit/order-visit-management');
        // }, errorCallback).finally(function () {
        //     $scope.isLoading = false;
        // });
    };

    $scope.updateOrderVisit = function () {
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

        confirmAlert('Bạn có chắc chắn muốn cập nhật không ?', confirmUpdate);
    };

    $scope.deleteOrderVisit = function (bookingVisitId, locationName) {

        function confirmDelete() {
            $scope.isLoading = true;

            VisitLocationTicketServiceAG.delete(bookingVisitId).then(function () {
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