travel_app.controller('OrderVisitControllerAG', function ($scope, $timeout, $filter, $sce, $location, $routeParams, OrderVisitServiceAG, LocalStorageService) {
    let searchTimeout;
    let orderVisitId = $routeParams.id;
    let brandId = LocalStorageService.get('brandId');
    let userId = $scope.user.id;

    $scope.isLoading = true;

    $scope.currentPage = 0;
    $scope.pageSize = 5;

    $scope.visitLocations = {};

    $scope.ticketTypes = {
        free: null,
        adult: null,
        child: null
    };

    $scope.intoPrice = {
        adult: null,
        child: null
    }

    $scope.unitPrice = {
        adult: null,
        child: null
    }

    $scope.orderVisit = {
        id: null,
        userId: userId,
        visitLocationId: null,
        customerName: null,
        customerCitizenCard: null,
        customerPhone: null,
        customerEmail: null,
        capacityFree: null,
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

                response.data.content.forEach(orderVisit => {
                    $scope.findVisitLocationName(orderVisit.visitLocationId);
                });
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
         * Tìm visitLocation bằng visitLocationId
         * @param visitLocationId
         */
        $scope.findVisitLocationName = function (visitLocationId) {
            if (!$scope.visitLocations[visitLocationId]) {
                OrderVisitServiceAG.findByVisitLocationId(visitLocationId).then(function (response) {
                    if (response.status === 200) {
                        $scope.visitLocations = response.data.data;
                    } else {
                        $location.path('/admin/page-not-found');
                    }
                }, errorCallback);
            }
        };

        /**
         * Update số lượng thì giá tiền cập nhật lun theo số lượng vé
         */
        $scope.updateTotalAdult = function () {
            if (!$scope.ticketTypes.free) {
                const selectedVisitLocation = $scope.visitLocationSelect.find(function (visitLocation) {
                    return visitLocation.id === $scope.orderVisit.visitLocationId;
                });

                if (selectedVisitLocation) {
                    for (let i = 0; i < selectedVisitLocation.visitLocationTicketsById.length; i++) {
                        const ticket = selectedVisitLocation.visitLocationTicketsById[i];

                        if (ticket.ticketTypeName === 'Vé người lớn') {
                            $scope.intoPrice.adult = ticket.unitPrice;
                            $scope.unitPrice.adult = $scope.formatPrice(ticket.unitPrice * $scope.orderVisit.capacityAdult);
                        }
                    }
                }

                $scope.orderVisit.capacityFree = null;
                $scope.unitPrice.free = null;
            }
        };

        $scope.updateTotalKid = function () {
            if (!$scope.ticketTypes.free) {
                const selectedVisitLocation = $scope.visitLocationSelect.find(function (visitLocation) {
                    return visitLocation.id === $scope.orderVisit.visitLocationId;
                });

                if (selectedVisitLocation) {
                    for (let i = 0; i < selectedVisitLocation.visitLocationTicketsById.length; i++) {
                        const ticket = selectedVisitLocation.visitLocationTicketsById[i];

                        if (ticket.ticketTypeName === 'Vé trẻ em') {
                            $scope.intoPrice.child = ticket.unitPrice;
                            $scope.unitPrice.child = $scope.formatPrice(ticket.unitPrice * $scope.orderVisit.capacityKid);
                        }
                    }
                }

                $scope.orderVisit.capacityFree = null;
                $scope.unitPrice.free = null;
            }
        };

        $scope.updateCheckboxStatus = function (ticketType) {
            if (ticketType === 'free' && $scope.ticketTypes.free) {
                $scope.ticketTypes.adult = false;
                $scope.ticketTypes.child = false;

                $scope.orderVisit.capacityAdult = null;
                $scope.orderVisit.capacityKid = null;
                $scope.unitPrice.adult = null;
                $scope.unitPrice.child = null;
            } else if ((ticketType === 'adult' || ticketType === 'child') && $scope.ticketTypes[ticketType]) {
                $scope.calculateTotalAmount();
                $scope.ticketTypes.free = false;
            }

            if (!$scope.ticketTypes[ticketType]) {
                const quantityKey = 'capacity' + ticketType.charAt(0).toUpperCase() + ticketType.slice(1);
                $scope.orderVisit[quantityKey] = null;
                $scope.unitPrice[ticketType] = null;
                $scope.calculateTotalAmount();
            }
        };

        $scope.calculateTotalAmount = function () {
            if (!$scope.ticketTypes.free) {
                const quantityAdult = $scope.orderVisit.capacityAdult || 0;
                const quantityChild = $scope.orderVisit.capacityKid || 0;

                const priceAdult = $scope.intoPrice.adult || 0;
                const priceChild = $scope.intoPrice.child || 0;

                $scope.orderVisit.orderTotal = $scope.formatPrice((quantityAdult * priceAdult) + (quantityChild * priceChild));
            }
        };

        $scope.$watchGroup(['adultQuantity', 'childQuantity', 'unitPrice.adult', 'unitPrice.child'], function () {
            if (!$scope.ticketTypes.free) {
                $scope.calculateTotalAmount();
            }
        });

        /**
         * Tìm orderVisit bằng id
         * @param orderVisitId
         */
        if (orderVisitId !== undefined && orderVisitId !== null && orderVisitId !== "") {
            OrderVisitServiceAG.findByOrderVisitId(orderVisitId).then(function (response) {
                if (response.status === 200) {
                    $scope.orderVisit = response.data.data;
                    let orderVisitDetails = response.data.data.orderVisitDetailsById
                    $scope.orderVisit.checkIn = new Date(response.data.data.checkIn);

                    for (let i = 0; i < orderVisitDetails.length; i++) {
                        let visitTicketId = orderVisitDetails[i].visitLocationTicketId;

                        $scope.visitLocationTicket = [];
                        OrderVisitServiceAG.findByVisitTicketId(visitTicketId).then(function (response) {
                            if (response.status === 200) {
                                const tickets = response.data.data;
                                $scope.visitLocationTicket = $scope.visitLocationTicket.concat(tickets);

                                for (const visitLocationTicket of $scope.visitLocationTicket) {
                                    visitLocationTicket.ticketTypeName === "Miễn phí vé" && ($scope.ticketTypes.free = true);
                                    visitLocationTicket.ticketTypeName === "Vé người lớn" && ($scope.ticketTypes.adult = true);
                                    visitLocationTicket.ticketTypeName === "Vé trẻ em" && ($scope.ticketTypes.child = true);

                                    if (visitLocationTicket.unitPrice) {
                                        if (visitLocationTicket.ticketTypeName === "Vé người lớn") {
                                            $scope.intoPrice.adult = visitLocationTicket.unitPrice;
                                        } else if (visitLocationTicket.ticketTypeName === "Vé trẻ em") {
                                            $scope.intoPrice.child = visitLocationTicket.unitPrice;
                                        }
                                    }
                                }
                            } else {
                                $location.path('/admin/page-not-found');
                            }
                        });
                    }

                    $scope.orderVisit.capacityFree = $scope.orderVisit.capacityAdult;
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

    $scope.createOrderVisit = function () {
        $scope.isLoading = true;
        $scope.orderVisit.orderTotal = $scope.replacePrice($scope.orderVisit.orderTotal);
        let dataOrderVisit = $scope.orderVisit;

        OrderVisitServiceAG.create(dataOrderVisit).then(function () {
            toastAlert('success', 'Tạo booking thành công !');
            $location.path('/business/visit/order-visit-management');
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    };

    $scope.updateOrderVisit = function () {
        function confirmUpdate() {
            $scope.isLoading = true;
            let dataOrderVisit = $scope.orderVisit;

            OrderVisitServiceAG.update(dataOrderVisit).then(function () {
                toastAlert('success', 'Cập nhật thành công !');
                $location.path('/business/visit/order-visit-management');
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        confirmAlert('Bạn có chắc chắn muốn cập nhật không ?', confirmUpdate);
    };

    $scope.deleteOrderVisit = function (orderVisitId, customerName) {
        function confirmDelete() {
            $scope.isLoading = true;

            OrderVisitServiceAG.delete(orderVisitId).then(function () {
                toastAlert('success', 'Xóa vé tham quan thành công !');
                $location.path('/business/visit/order-visit-management');
                $scope.init();
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        confirmAlert('Bạn có chắc chắn muốn xóa vé tham quan của khách hàng ' + customerName + ' không ?', confirmDelete);
    };

    $scope.init();
});