travel_app.controller('AgencyControllerAD',
    function ($scope, $http, $location, $sce, $rootScope, $routeParams, $timeout, Base64ObjectService, LocalStorageService,
              AgencyServiceAD, HotelServiceAG, TransportBrandServiceAG, VisitLocationServiceAG) {
        $scope.hasImage = false;
        $scope.count = 0;

        $scope.currentTab = LocalStorageService.get('currentTabAgencies') || 'online';

        // Trang hiện tại
        $scope.currentPage = 0;
        $scope.pageSize = 5;

        $scope.phoneError = null;
        $scope.taxIdError = null;

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
            isActive: null,
            noted: null
        }

        // Biến để lưu danh sách tỉnh thành
        $scope.provinces = [];
        $scope.districts = [];
        $scope.wards = [];

        let searchTimeout;
        $scope.agenciesId = Base64ObjectService.decodeObject($routeParams.id);

        //================================================================

        function errorCallback() {
            $location.path('/admin/internal-server-error')
        }

        /**
         * Phương thức chuyển đổi tab
         * @param tab
         * @param isActive
         */
        $scope.changeTab = (tab, isActive) => {
            $scope.currentTab = tab;
            $scope.isActive = isActive;
            $scope.init();
            LocalStorageService.set('currentTabAgencies', tab);
        };

        if ($scope.currentTab === 'online') {
            $scope.changeTab('online', true);
        } else {
            $scope.changeTab('offline', false);
        }

        $scope.init = function () {
            $scope.isLoading = true;

            /**
             * Tìm kiếm tất cả dữ liệu ra bảng
             */
            AgencyServiceAD.findAllAgenciesByIsAcceptedAD($scope.isActive, $scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir)
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
                }
            );

            /**
             * Tìm kiếm
             */
            $scope.searchAgencies = function () {
                if (searchTimeout) $timeout.cancel(searchTimeout);

                searchTimeout = $timeout(function () {
                    AgencyServiceAD.findAllAgenciesByIsAcceptedAD($scope.isActive, $scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.searchTerm)
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
             * Tìm kiếm fill lên input form update
             */
            if ($scope.agenciesId !== undefined && $scope.agenciesId !== null && $scope.agenciesId !== "") {
                AgencyServiceAD.findAgenciesById($scope.agenciesId).then(function (response) {
                    $scope.agent = response.data.data;
                    $rootScope.taxnow = response.data.data.taxId;
                    $rootScope.phonenow = response.data.data.phone;

                    $http.get('/lib/address/data.json').then(function (response) {
                        $scope.provinces = response.data;

                        if (response.status === 200) {
                            let selectedProvince = $scope.provinces.find(p => p.Name === $scope.agent.province);

                            if (selectedProvince) {
                                $scope.agent.province = selectedProvince.Name;
                                $scope.districts = selectedProvince ? selectedProvince.Districts : [];

                                let selectedDistrict = $scope.districts.find(d => d.Name === $scope.agent.district);

                                if (selectedDistrict) {
                                    $scope.agent.district = selectedDistrict.Name;
                                }

                                $scope.wards = selectedDistrict ? selectedDistrict.Wards : [];
                            }
                        }
                    }, errorCallback);

                }, errorCallback).finally(function () {
                        $scope.isLoading = false;
                    }
                );
            }

            /**
             * API lấy dữ liệu tỉnh thành và fill dữ liệu lên select
             */
            $scope.onProvinceChange = function () {
                let selectedProvince = $scope.provinces.find(p => p.Name === $scope.agent.province);

                if (selectedProvince) {
                    $scope.agent.provinceName = selectedProvince.Name;
                }

                $scope.districts = selectedProvince ? selectedProvince.Districts : [];
                $scope.agent.district = null;
                $scope.agent.ward = null;
            };

            $scope.onDistrictChange = function () {
                let selectedDistrict = $scope.districts.find(d => d.Name === $scope.agent.district);

                if (selectedDistrict) {
                    $scope.agent.districtName = selectedDistrict.Name;
                }

                $scope.wards = selectedDistrict ? selectedDistrict.Wards : [];
                $scope.agent.ward = null;
                $scope.agent.wardName = null;
            };

            $scope.onWardChange = function () {
                let selectedWard = $scope.wards.find(w => w.Name === $scope.agent.ward);
                if (selectedWard) {
                    $scope.agent.wardName = selectedWard.Name;
                }
            };

            /**
             * Hàm để upload image
             * @param file
             */
            $scope.uploadTourImage = function (file) {
                if (file && !file.$error) {
                    let reader = new FileReader();

                    reader.onload = function (e) {
                        $scope.agent.imgDocument = e.target.result;
                        $scope.tourImgNoCloud = file;
                        $scope.hasImage = true; // Đánh dấu là đã có ảnh
                        $scope.$apply();
                    };

                    reader.readAsDataURL(file);
                }
            };

            /**
             * Lấy ra image cũ
             * @returns {string}
             */
            $scope.getCurrentImageSource = function () {
                if ($scope.agent.imgDocument && typeof $scope.agent.imgDocument === 'string' && $scope.agent.imgDocument.startsWith('http')) {
                    $scope.tourImgNoCloud = $scope.agent.imgDocument;
                    return $scope.agent.imgDocument;
                } else if ($scope.agent.imgDocument && typeof $scope.agent.imgDocument === 'string') {
                    return $scope.agent.imgDocument;
                }
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
                $scope.currentPage = 0; // Đặt lại về trang đầu tiên
                $scope.init(); // Tải lại dữ liệu với kích thước trang mới
            };

            $scope.getDisplayRange = function () {
                return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
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

            $scope.updateWaitingCount = function () {
                AgencyServiceAD.countAllWaiting().then(function (response) {
                    if (response.status === 200) {
                        $scope.count = response.data.data;
                    } else {
                        $scope.count = 0;
                    }
                }, errorCallback);
            };
            setInterval(function () {
                $scope.updateWaitingCount();
            }, 2000);


            /**
             * @message Check duplicate phone
             */
            $scope.checkDuplicateThisPhone = function () {
                if ($scope.agent.phone === $rootScope.phonenow) {
                    $scope.phoneError = false;
                    return;
                }
                AgencyServiceAD.checkExistPhone($scope.agent.phone)
                    .then(function (response) {
                        if (response.data.data.status === 200) {
                            $scope.phoneError = response.data.data.exists;
                        } else {
                            $scope.phoneError = response.data.data.exists;
                        }
                    });
            };

            /**
             * @message Check duplicate taxId
             */
            $scope.checkDuplicateThisTax = function () {
                if ($scope.agent.taxId === $rootScope.taxnow) {
                    $scope.taxIdError = false;
                    return;
                }
                AgencyServiceAD.checkExistTax($scope.agent.taxId)
                    .then(function (response) {
                        if (response.data.data.status === 200) {
                            $scope.taxIdError = response.data.data.exists;
                        } else {
                            $scope.taxIdError = response.data.data.exists;
                        }
                    });
            };
        };

        $scope.init();

        /**
         * Update agencies
         */
        function confirmUpdate() {
            $scope.isLoading = true;
            const agenciesDto = new FormData();

            if ($scope.hasImage) {
                agenciesDto.append("agenciesDto", new Blob([JSON.stringify($scope.agent)], {type: "application/json"}));
                agenciesDto.append("agenciesImg", $scope.tourImgNoCloud);
                updateAgencies($scope.agenciesId, agenciesDto);
            } else {
                agenciesDto.append("agenciesDto", new Blob([JSON.stringify($scope.agent)], {type: "application/json"}));
                updateAgencies($scope.agenciesId, agenciesDto);
            }
        }

        const updateAgencies = (agenciesId, agenciesDto) => {
            AgencyServiceAD.updateAgency(agenciesId, agenciesDto).then(function (response) {
                if (response.status === 200) {
                    toastAlert('success', 'Cập nhật thành công!');
                    $location.path('/admin/agency/agency-list');
                } else {
                    $location.path('/admin/page-not-found');
                }
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        $scope.updateTourSubmit = function () {
            confirmAlert('Bạn có chắc chắn muốn cập nhật doanh nghiệp này không ?', confirmUpdate);
        }

        /**
         * Xóa doanh nghiệp
         * @param agenciesId
         * @param nameAgencies
         */
        $scope.deleteThisAgency = function (agenciesId, nameAgencies) {
            function confirmDeleteTour() {
                $scope.isLoading = true;

                AgencyServiceAD.deleteAgency(agenciesId, $scope.agent.noted).then(function (response) {
                    if (response.status === 200) {
                        $scope.changeTab('offline', false);
                        centerAlert('Thành công', `Tạm ngưng hoạt động doanh nghiệp ${nameAgencies} thành công !`, 'success');

                        $timeout(function () {
                            $('#noted-agencies').modal('hide');
                            $('#modal-agencies').modal('hide');
                        }, 100);
                    } else {
                        $location.path('/admin/page-not-found');
                    }
                }).finally(function () {
                    $scope.isLoading = false;
                });
            }

            confirmAlert(`Bạn có chắc chắn muốn tạm ngưng hoạt động doanh nghiệp ${nameAgencies} không ?`, confirmDeleteTour);
        }

        /**
         * Khôi phục doanh nghiệp
         * @param agenciesId
         * @param nameAgencies
         */
        $scope.restoreThisAgency = function (agenciesId, nameAgencies) {
            function confirmRestoreTour() {
                $scope.isLoading = true;

                AgencyServiceAD.restoreAgency(agenciesId).then(function (response) {
                    if (response.status === 200) {
                        $scope.changeTab('online', true);
                        centerAlert('Thành công', `Khôi phục hoạt động doanh nghiệp ${nameAgencies} thành công !`, 'success');

                        $timeout(function () {
                            $('#modal-agencies').modal('hide');
                        }, 100);
                    } else {
                        $location.path('/admin/page-not-found');
                    }
                }, errorCallback).finally(function () {
                    $scope.isLoading = false;
                });
            }

            confirmAlert(`Bạn có chắc chắn muốn khôi phục hoạt động cho doanh nghiệp ${nameAgencies} không ?`, confirmRestoreTour);
        }

        /**
         * Mở modal xem thông tin doanh nghiệp chi tiết
         * @param agenciesId
         */
        $scope.openModalInfoAgencies = function (agenciesId) {
            $scope.agent.noted = null;
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