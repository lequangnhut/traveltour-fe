travel_app.controller('AgencyControllerAD', function ($scope, $http, $location, $sce, $rootScope, $routeParams, $timeout, AgencyServiceAD) {

    const fileName = "default.jpg";
    const mimeType = "image/jpeg";

    $scope.hasImage = false;
    $scope.count = 0;
    $scope.typeList = [];
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
        isActive: null
    }
    // Biến để lưu danh sách tỉnh thành
    $scope.provinces = [];
    $scope.districts = [];
    $scope.wards = [];

    let searchTimeout;
    let typeId = $routeParams.id;

    //================================================================

    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }


    $scope.uploadTourImage = function (file) {
        if (file && !file.$error) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $scope.agent.imgDocument = e.target.result;
                $scope.tourImgNoCloud = file;
                $scope.hasImage = true; // Đánh dấu là đã có ảnh
                $scope.$apply();
            };

            reader.readAsDataURL(file);
            console.log(reader)
        }
    };

    $scope.getCurrentImageSource = function () {
        if ($scope.agent.imgDocument && typeof $scope.agent.imgDocument === 'string' && $scope.agent.imgDocument.startsWith('http')) {
            $scope.tourImgNoCloud = $scope.agent.imgDocument;
            return $scope.agent.imgDocument;
        } else if ($scope.agent.imgDocument && typeof $scope.agent.imgDocument === 'string') {
            return $scope.agent.imgDocument;
        }
    };


    $scope.setPage = function (page) {
        if (page >= 0 && page < $scope.totalPages) {
            $scope.currentPage = page;
            $scope.getTypeList();
        }
    };

    $scope.getPaginationRange = function () {
        var range = [];
        var start, end;
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
        for (var i = start; i < end; i++) {
            range.push(i);
        }
        return range;
    };

    $scope.pageSizeChanged = function () {
        $scope.currentPage = 0; // Đặt lại về trang đầu tiên
        $scope.getTypeList(); // Tải lại dữ liệu với kích thước trang mới
    };

    $scope.getDisplayRange = function () {
        return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
    };

    //show list
    $scope.getTypeList = function () {
        $scope.isLoading = true;
        AgencyServiceAD.findAllType($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir)
            .then(function (response) {
                if (response.data.status === "404") {
                    $scope.typeList.length = 0;
                    $scope.totalElements = 0;
                } else {
                    $scope.typeList = response.data.data.content;
                    $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                    $scope.totalElements = response.data.data.totalElements;
                }
            }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });

        if (typeId !== undefined && typeId !== null && typeId !== "") {
            AgencyServiceAD.findAgencieById(typeId)
                .then(function successCallback(res) {
                    $scope.agent = res.data.data;
                    $rootScope.taxnow = res.data.data.taxId;
                    $rootScope.phonenow = res.data.data.phone;
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
            });
        }
        ;
    };

    $scope.sortData = function (column) {
        $scope.sortBy = column;
        $scope.sortDir = ($scope.sortDir === 'asc') ? 'desc' : 'asc';
        $scope.getTypeList();
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

    $scope.searchTypes = function () {
        if (searchTimeout) $timeout.cancel(searchTimeout);
        searchTimeout = $timeout(function () {
            AgencyServiceAD.findAllType($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.searchTerm)
                .then(function (response) {
                    if (response.data.data === null) {
                        $scope.typeList.length = 0;
                        $scope.totalElements = 0;
                    } else {
                        $scope.typeList = response.data.data.content;
                        $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                        $scope.totalElements = response.data.data.totalElements;
                    }
                }, errorCallback);
        }, 500); // 500ms debounce
    };

    $scope.getTypeList();

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
    }, 5000);


    /**
     * API lấy dữ liệu tỉnh thành và fill dữ liệu lên select
     */
    $scope.onProvinceChange = function () {
        var selectedProvince = $scope.provinces.find(p => p.Name === $scope.agent.province);
        if (selectedProvince) {
            $scope.agent.provinceName = selectedProvince.Name;
        }

        $scope.districts = selectedProvince ? selectedProvince.Districts : [];
        $scope.agent.district = null;
        $scope.agent.ward = null;

    };
    $scope.onDistrictChange = function () {
        var selectedDistrict = $scope.districts.find(d => d.Name === $scope.agent.district);
        if (selectedDistrict) {
            $scope.agent.districtName = selectedDistrict.Name;
        }

        $scope.wards = selectedDistrict ? selectedDistrict.Wards : [];
        $scope.agent.ward = null;
        $scope.agent.wardName = null;
    };
    $scope.onWardChange = function () {
        var selectedWard = $scope.wards.find(w => w.Name === $scope.agent.ward);
        if (selectedWard) {
            $scope.agent.wardName = selectedWard.Name;
        }
    };

    /**
     * @message Check duplicate phone
     */
    $scope.checkDuplicateThisPhone = function () {
        if($scope.agent.phone == $rootScope.phonenow){
            $scope.phoneError = false;
            return;
        }
        AgencyServiceAD.checkExistPhone($scope.agent.phone)
            .then(function successCallback(response) {
                if (response.data.data.status === 200){
                    $scope.phoneError = response.data.data.exists;
                }else{
                    $scope.phoneError = response.data.data.exists;
                }
            });
    };

    /**
     * @message Check duplicate taxId
     */
    $scope.checkDuplicateThisTax = function () {
        if($scope.agent.taxId == $rootScope.taxnow){
            $scope.taxIdError = false;
            return;
        }
        AgencyServiceAD.checkExistTax($scope.agent.taxId)
            .then(function successCallback(response) {
            if (response.data.data.status === 200){
                $scope.taxIdError = response.data.data.exists;
            }else{
                $scope.taxIdError = response.data.data.exists;
            }
        });
    };

    //==================================================================================================================


    function urlToFile(url, fileName, mimeType) {
        return fetch(url)
            .then(response => response.blob())
            .then(blob => new File([blob], fileName, {type: mimeType}));
    }

    //form update
    function confirmUpdate() {
        $scope.isLoading = true;
        const dataTour = new FormData();

        if ($scope.hasImage) {
            dataTour.append("toursDto", new Blob([JSON.stringify($scope.agent)], {type: "application/json"}));
            dataTour.append("tourImg", $scope.tourImgNoCloud);
            updateTour(typeId, dataTour);
        } else {
            urlToFile($scope.agent.imgDocument, fileName, mimeType).then(file => {
                dataTour.append("toursDto", new Blob([JSON.stringify($scope.agent)], {type: "application/json"}));
                dataTour.append("tourImg", file);
                updateTour(typeId, dataTour);
            }, errorCallback);
        }
    };

    const updateTour = (typeId, dataTour) => {
        AgencyServiceAD.updateAgency(typeId, dataTour).then(function successCallback() {
            toastAlert('success', 'Cập nhật thành công !');
            $location.path('/admin/agency/agency-list');
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    }

    $scope.updateTourSubmit = function () {
        confirmAlert('Bạn có chắc chắn muốn cập nhật không ?', confirmUpdate);
    }

    $scope.deleteThisAgency = function (typeId) {
        function confirmDeleteTour() {
            AgencyServiceAD.deleteAgency(typeId).then(function successCallback() {
                toastAlert('success', 'Xóa thành công !');
                $scope.getTypeList();
            }, errorCallback);
        }

        confirmAlert('Bạn có chắc chắn muốn xóa doanh nghiệp này không ?', confirmDeleteTour);
    }

    $scope.openModal = function (typeId) {
        if (!$scope.agent) {
            return;
        }

        fillModalWithData(typeId);
        $('#scrollingLong2').modal('show');
    };

    function fillModalWithData(typeId) {
        if (typeId !== undefined && typeId !== null && typeId !== "") {
            AgencyServiceAD.findAgencieById(typeId)
                .then(function successCallback(res) {
                    $scope.agent = res.data.data;
                }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }
        ;
    }
});