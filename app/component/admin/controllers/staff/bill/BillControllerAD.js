travel_app.controller('BillControllerAD',
    function ($scope, $sce, $q, $location, $routeParams, $timeout, BillTourServiceAD, TourDetailsServiceAD, PrintService) {
        $scope.isLoading = true;
        let searchTimeout;

        $scope.invoicesList = [];
        $scope.currentPage = 0;
        $scope.pageSize = 5;

        $scope.invoices = {bookingTourId: null}

        function errorCallback() {
            $location.path('/admin/internal-server-error')
        }

        $scope.changeTab = (tab, status) => {
            $scope.currentTab = tab;
            $scope.orderStatus = status;
            $scope.getInvoicesList();
        };

        //phân trang
        $scope.setPage = function (page) {
            if (page >= 0 && page < $scope.totalPages) {
                $scope.currentPage = page;
                $scope.getInvoicesList();
            }
        };

        $scope.getPaginationRange = () => {
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

        $scope.pageSizeChanged = () => {
            $scope.currentPage = 0;
            $scope.getInvoicesList();
        };

        $scope.getDisplayRange = () => {
            return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
        };

        const invoicesData = (response) => {
            $scope.invoicesList = response.data.data !== null ? response.data.data.content : [];
            $scope.totalPages = response.data.data !== null ? Math.ceil(response.data.data.totalElements / $scope.pageSize) : 0;
            $scope.totalElements = response.data.data !== null ? response.data.data.totalElements : 0;

            const promises = $scope.invoicesList.map((invoice) => {
                return TourDetailsServiceAD.findTourDetailById(invoice.bookingToursByBookingTourId.tourDetailId).then((response) => {
                    invoice.tourDetailsByTourDetailId = response.data.data;
                    return invoice;
                });
            });

            $q.all(promises).then(() => {
            }).catch((error) => {
                console.error("Error occurred: ", error);
            });
        };

        $scope.getInvoicesList = () => {
            $scope.isLoading = true;
            BillTourServiceAD.getAll($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir)
                .then((response) => {
                    invoicesData(response)
                }, errorCallback).finally(() => {
                $scope.isLoading = false;
            });
        };


        //sắp xếp
        $scope.sortData = (column) => {
            $scope.sortBy = column;
            $scope.sortDir = ($scope.sortDir === 'asc') ? 'desc' : 'asc';
            $scope.getInvoicesList();
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
        $scope.searchInvoices = () => {
            if (searchTimeout) $timeout.cancel(searchTimeout);
            $scope.currentPage = 0

            searchTimeout = $timeout(() => {
                BillTourServiceAD.getAll($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.searchTerm)
                    .then((response) => {
                        invoicesData(response)
                    }, errorCallback);
            }, 500);
        };

        $scope.deleteInvoices = (id) => {
            const confirm = () => {
                BillTourServiceAD.deactivate(id).then(() => {
                    toastAlert('success', 'Hủy thành công !');
                    $('#modal-tour-detail').modal('hide');
                    $scope.getInvoicesList();
                }, errorCallback);
            }

            confirmAlert('Bạn có chắc chắn muốn hủy booking này không ?', confirm);
        }

        $scope.getInvoicesList();

        $scope.openModalDetail = (tourDetailId) => {
            $('#modal-tour-detail').modal('show');

            if (!tourDetailId) return;

            TourDetailsServiceAD.findTourDetailById(tourDetailId)
                .then(response => {
                    if (response.status === 200) {
                        $timeout(() => {
                            $scope.tourDetail = response.data.data;
                        }, 0);
                    }
                })
                .catch(errorCallback);
        }

        $scope.openModalCancelTransaction = (data) => {
            $('#modal-cancel-transaction').modal('show');
            $scope.invoices = data;
        }

        /**
         * Phương thức đóng modal
         */
        $scope.closeModalDetail = () => {
            $('#modal-tour-detail').modal('hide');
        };

        $scope.printInvoice = (i) => {
            PrintService.print(i);
        };

    });
