travel_app.controller('AgencyControllerWaitingAD',
    function ($scope, $location, $sce, $rootScope, $timeout, AgencyServiceAD,
              HotelServiceAG, TransportBrandServiceAG, VisitLocationServiceAG) {
        $scope.hasImage = false;
        $scope.loading = true;
        $scope.count = 0;

        $scope.currentTab = 'accepted';

        $scope.agenciesList = [];

        // Biến để lưu danh sách tỉnh thành
        $scope.provinces = [];
        $scope.districts = [];
        $scope.wards = [];

        // Trang hiện tại
        $scope.currentPage = 0;
        $scope.pageSize = 5;

        $scope.agent = {
            nameAgency: null,
            representativeName: null,
            taxId: null,
            urlWebsite: null,
            phone: null,
            imgDocument: null,
            province: null,
            district: null,
            ward: null,
            address: null,
            dateCreated: null,
            isAccepted: null,
            isActive: null,
            noted: null
        }

        let searchTimeout;

        //================================================================

        function errorCallback() {
            $location.path('/admin/internal-server-error')
        }

        /**
         * Phương thức chuyển đổi tab
         * @param tab
         * @param isAccepted
         */
        $scope.changeTab = (tab, isAccepted) => {
            $scope.currentTab = tab;
            $scope.isAccepted = isAccepted;
            $scope.currentPage = 0;
            $scope.pageSize = '5';
            $scope.init();
        };

        if ($scope.currentTab === 'accepted') {
            $scope.changeTab('accepted', 1);
        } else {
            $scope.changeTab('dismiss', 3);
        }

        $scope.init = function () {
            $scope.isLoading = true;

            /**
             * Tìm kiếm tất cả dữ liệu ra bảng
             */
            AgencyServiceAD.findAllAgenciesByIsAcceptedWaitingAD($scope.isAccepted, $scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir)
                .then(function (response) {
                    if (response.status === 200) {
                        if (response.data.data !== null) {
                            $scope.agenciesList = response.data.data.content;
                            $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                            $scope.totalElements = response.data.data.totalElements;
                        } else {
                            $scope.agenciesList.length = 0;
                            $scope.totalElements = 0;
                        }
                    } else {
                        $scope.agenciesList.length = 0;
                        $scope.totalElements = 0;
                    }
                }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });

            /**
             * Tìm kiếm
             */
            $scope.searchAgencies = function () {
                if (searchTimeout) $timeout.cancel(searchTimeout);
                searchTimeout = $timeout(function () {
                    AgencyServiceAD.findAllAgenciesByIsAcceptedWaitingAD($scope.isAccepted, $scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.searchTerm)
                        .then(function (response) {
                            if (response.status === 200) {
                                if (response.data.data !== null) {
                                    $scope.agenciesList = response.data.data.content;
                                    $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                                    $scope.totalElements = response.data.data.totalElements;
                                } else {
                                    $scope.agenciesList.length = 0;
                                    $scope.totalElements = 0;
                                }
                            } else {
                                $scope.agenciesList.length = 0;
                                $scope.totalElements = 0;
                            }
                        }, errorCallback);
                }, 500);
            };

            /**
             * Phân trang
             * @param page
             */
            $scope.setPage = function (page) {
                if (page >= 0 && page < $scope.totalPages) {
                    $scope.currentPage = page;
                    $scope.init();
                }
            };

            $scope.getPaginationRange = function () {
                let range = [];
                let start, end;
                if ($scope.totalPages <= 3) {
                    // Nếu tổng số trang nhỏ hơn hoặc bằng 5, hiển thị tất cả các trang
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
                $scope.currentPage = 0; // Đặt l ại về trang đầu tiên
                $scope.init(); // Tải lại dữ liệu với kích thước trang mới
            };

            $scope.getDisplayRange = function () {
                return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
            };

            $scope.getDisplayIndex = function (index) {
                return index + 1 + $scope.currentPage * $scope.pageSize;
            };

            /**
             * Sắp xếp
             * @param column
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
        };

        $scope.init();

        /**
         * Phương thức phê duyệt hồ sơ
         */
        $scope.acceptedThisAgency = function (agenciesId, nameAgencies) {
            function confirmAccept() {
                $scope.isLoading = true;

                AgencyServiceAD.acceptAgency(agenciesId).then(function () {
                    $scope.init();
                    toastAlert('success', 'Phê duyệt thành công !');

                    $location.path("admin/agency/agency-list")
                    $('#modal-agencies').modal('hide');
                    $scope.setActiveNavItem('agency-list');
                }, errorCallback).finally(function () {
                    $scope.isLoading = false;
                });
            }

            confirmAlert(`Bạn có chắc chắn muốn phê duyệt hồ sơ của doanh nghiệp ${nameAgencies} không ?`, confirmAccept);
        }

        /**
         * Phương thức từ chối hồ sơ
         */
        $scope.deniedThisAgency = function (agenciesId, nameAgencies) {
            function confirmDeny() {
                AgencyServiceAD.deniedAgency(agenciesId, $scope.agent.noted).then(function () {
                    $scope.init();
                    $scope.changeTab('dismiss', 3);
                    toastAlert('success', 'Từ chối hồ sơ thành công !');

                    $timeout(function () {
                        $('#noted-agencies').modal('hide');
                        $('#modal-agencies').modal('hide');
                    }, 100);
                }, errorCallback).finally(function () {
                    $scope.isLoading = false;
                });
            }

            confirmAlert(`Bạn có chắc chắn muốn từ chối hồ sơ của doanh nghiệp ${nameAgencies} không ?`, confirmDeny);
        }

        /**
         * Mở modal xem thông tin doanh nghiệp chi tiết
         * @param agenciesId
         */
        $scope.openModalInfoAgencies = function (agenciesId) {
            $('#modal-agencies').modal('show');

            if (agenciesId !== undefined && agenciesId !== null && agenciesId !== "") {
                AgencyServiceAD.findAgenciesById(agenciesId).then(function (response) {
                    if (response.status === 200) {
                        $scope.agencies = response.data.data;
                        $scope.rolesAgenciesAD = response.data.data.usersByUserId.roles.map(role => role.nameRole);

                        HotelServiceAG.findAllByAgencyId($scope.agencies.id).then(function (response) {
                            if (response.status === 200) {
                                $scope.hotels = response.data[0];
                            } else {
                                $location.path('/admin/page-not-found');
                            }
                        });

                        TransportBrandServiceAG.findAllByAgencyId($scope.agencies.id).then(function (response) {
                            if (response.status === 200) {
                                $scope.transport = response.data[0];
                            } else {
                                $location.path('/admin/page-not-found');
                            }
                        });

                        VisitLocationServiceAG.findAllByAgencyId($scope.agencies.id).then(function (response) {
                            if (response.status === 200) {
                                $scope.visits = response.data[0];
                            } else {
                                $location.path('/admin/page-not-found');
                            }
                        });
                    } else {
                        $location.path('/admin/page-not-found');
                    }
                }, errorCallback).finally(function () {
                    $scope.isLoading = false;
                });
            }
        };

        $scope.hideModalInfoAgencies = function () {
            $('#modal-agencies').modal('show');
        }
    });