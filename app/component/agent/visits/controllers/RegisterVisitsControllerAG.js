travel_app.controller('RegisterVisitsControllerAG', function ($scope, $http, $routeParams, $filter, $location, AuthService, VisitLocationServiceAG) {
    let visitLocationId = $routeParams.id;

    $scope.currentStep = 1;
    $scope.checkboxChecked = false;
    $scope.phoneError = null;

    $scope.nextStep = function () {
        if ($scope.currentStep < 4) {
            $scope.currentStep++;
        }
    };

    $scope.prevStep = function () {
        if ($scope.currentStep <= 4) {
            $scope.currentStep--;
        }
    };

    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    $scope.address = {
        province: null,
        district: null,
        ward: null
    }

    $scope.ticketTypes = {
        free: null,
        adult: null,
        child: null
    };

    $scope.unitPrice = {
        adult: null,
        child: null
    }

    $scope.visitLocation = {
        id: null,
        visitLocationName: null,
        visitLocationImage: null,
        visitLocationTypeId: null,
        userId: null,
        urlWebsite: null,
        phone: null,
        province: null,
        district: null,
        ward: null,
        address: null,
        openingTime: null,
        closingTime: null,
        agenciesId: null
    }

    $scope.init = function () {
        /**
         * API lấy dữ liệu loại địa điểm
         */
        VisitLocationServiceAG.findAllVisitType().then(function successCallback(response) {
            $scope.visitType = response.data;
        }, errorCallback);

        /**
         * API lấy dữ liệu tỉnh thành và fill dữ liệu lên select
         */
        $http.get('/lib/address/data.json').then(function (response) {
            $scope.provinces = response.data;

            /**
             * onChange cho form register và create
             */
            $scope.onProvinceChangeCreate = function () {
                var selectedProvince = $scope.provinces.find(p => p.Id === $scope.address.province);
                if (selectedProvince) {
                    $scope.visitLocation.province = selectedProvince.Name;
                }

                $scope.districts = selectedProvince ? selectedProvince.Districts : [];
                $scope.visitLocation.district = null;
                $scope.visitLocation.ward = null;
            };

            $scope.onDistrictChangeCreate = function () {
                var selectedDistrict = $scope.districts.find(d => d.Id === $scope.address.district);
                if (selectedDistrict) {
                    $scope.visitLocation.district = selectedDistrict.Name;
                }

                $scope.wards = selectedDistrict ? selectedDistrict.Wards : [];
                $scope.visitLocation.ward = null;
            };

            $scope.onWardChangeCreate = function () {
                var selectedWard = $scope.wards.find(w => w.Id === $scope.address.ward);
                if (selectedWard) {
                    $scope.visitLocation.ward = selectedWard.Name;
                }
            };

            /**
             * onChange cho form update
             */
            $scope.onProvinceChangeUpdate = function () {
                var selectedProvince = $scope.provinces.find(p => p.Name === $scope.address.province);
                if (selectedProvince) {
                    $scope.visitLocation.province = selectedProvince.Name;
                }

                $scope.districts = selectedProvince ? selectedProvince.Districts : [];
                $scope.visitLocation.district = null;
                $scope.visitLocation.ward = null;
            };

            $scope.onDistrictChangeUpdate = function () {
                var selectedDistrict = $scope.districts.find(d => d.Name === $scope.address.district);
                if (selectedDistrict) {
                    $scope.visitLocation.district = selectedDistrict.Name;
                }

                $scope.wards = selectedDistrict ? selectedDistrict.Wards : [];
                $scope.visitLocation.ward = null;
            };

            $scope.onWardChangeUpdate = function () {
                var selectedWard = $scope.wards.find(w => w.Name === $scope.address.ward);
                if (selectedWard) {
                    $scope.visitLocation.ward = selectedWard.Name;
                }
            };

            /**
             * @message Check duplicate phone
             */
            $scope.checkDuplicatePhone = function () {
                AuthService.checkExistPhone($scope.visitLocation.phone).then(function successCallback(response) {
                    $scope.phoneError = response.data.exists;
                }, errorCallback);
            };

            if (visitLocationId !== undefined && visitLocationId !== null && visitLocationId !== "") {
                VisitLocationServiceAG.findByVisitLocationId(visitLocationId).then(function successCallback(response) {
                    if (response.status === 200) {
                        $scope.visitLocation = response.data.data;
                        $scope.address.province = response.data.data.province
                        $scope.address.district = response.data.data.district
                        $scope.address.ward = response.data.data.ward

                        let selectedProvince = $scope.provinces.find(p => p.Name === $scope.address.province);

                        if (selectedProvince) {
                            $scope.address.province = selectedProvince.Name;
                            $scope.districts = selectedProvince ? selectedProvince.Districts : [];

                            let selectedDistrict = $scope.districts.find(d => d.Name === $scope.address.district);

                            if (selectedDistrict) {
                                $scope.address.district = selectedDistrict.Name;
                            }
                            $scope.wards = selectedDistrict ? selectedDistrict.Wards : [];
                        }

                        $scope.ticketTypes = response.data.data.visitLocationTicketsById;
                        $scope.unitPrices = [];

                        for (let i = 0; i < $scope.ticketTypes.length; i++) {
                            const ticket = $scope.ticketTypes[i];

                            ticket.ticketTypeName === "Miễn phí vé" && ($scope.ticketTypes.free = true);
                            ticket.ticketTypeName === "Vé người lớn" && ($scope.ticketTypes.adult = true);
                            ticket.ticketTypeName === "Vé trẻ em" && ($scope.ticketTypes.child = true);

                            if (ticket.unitPrice) {
                                $scope.unitPrices.push(ticket.unitPrice);
                                $scope.unitPrice.adult = $scope.unitPrices[0];
                                $scope.unitPrice.child = $scope.unitPrices[1];
                            }
                        }
                    } else {
                        $location.path('/admin/page-not-found')
                    }
                }, errorCallback);
            }
        }, errorCallback);
    }

    /**
     * Upload hình ảnh và lưu vào biến visitLocationImage
     * @param file
     */
    $scope.uploadVisitLocationImage = function (file) {
        if (file && !file.$error) {
            $scope.visitLocation.visitLocationImage = file;
        }
    };

    /**
     * Submit gửi dữ liệu cho api
     */
    $scope.unitPrices = [];

    $scope.updatePrices = function (ticketType) {
        if ($scope.ticketTypes[ticketType]) {
            $scope.unitPrices[ticketType] = $scope.unitPrice[ticketType];
        } else {
            delete $scope.unitPrices[ticketType];
        }
    };

    $scope.submitDataRegisterVisits = function () {
        VisitLocationServiceAG.findAllByAgencyId($scope.agencies.id).then(function successCallback(response) {
            let locationVisit = response.data;

            if (locationVisit.length === 1) {
                let existingVisit = locationVisit[0];

                if (existingVisit.visitLocationName == null) {
                    $scope.submitAPIVisit('register', '/business/select-type');
                } else {
                    $scope.submitAPIVisit('create', '/business/visit/home');
                }
            } else {
                $scope.submitAPIVisit('create');
            }
        }, errorCallback);
    }

    $scope.submitAPIVisit = function (apiUrl, urlRedirect) {
        const selectedTickets = [];
        const unitPrices = {};
        $scope.isLoading = true;

        if ($scope.ticketTypes.free) {
            selectedTickets.push("Miễn phí vé");
        }
        if ($scope.ticketTypes.adult) {
            selectedTickets.push("Vé người lớn");
        }
        if ($scope.ticketTypes.child) {
            selectedTickets.push("Vé trẻ em");
        }
        if ($scope.ticketTypes.adult) {
            unitPrices.adult = $scope.unitPrice.adult;
        }
        if ($scope.ticketTypes.child) {
            unitPrices.child = $scope.unitPrice.child;
        }

        $scope.visitLocation.openingTime = $filter('date')($scope.visitLocation.openingTime, 'HH:mm:ss');
        $scope.visitLocation.closingTime = $filter('date')($scope.visitLocation.closingTime, 'HH:mm:ss');
        $scope.visitLocation.agenciesId = $scope.agencies.id;

        const dataVisit = new FormData();
        dataVisit.append("visitLocationsDto", new Blob([JSON.stringify($scope.visitLocation)], {type: "application/json"}));
        dataVisit.append("visitLocationImage", $scope.visitLocation.visitLocationImage);
        dataVisit.append("selectedTickets", new Blob([JSON.stringify(selectedTickets)], {type: "application/json"}));
        dataVisit.append("unitPrices", new Blob([JSON.stringify(unitPrices)], {type: "application/json"}));

        VisitLocationServiceAG.registerVisit(dataVisit, apiUrl).then(function successCallback() {
            $location.path(urlRedirect);
            centerAlert('Thành công !', 'Thông tin địa điểm tham quan đã được cập nhật thành công.', 'success')
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    };

    $scope.updateVisitLocation = function () {
        function confirmUpdate() {
            const selectedTickets = [];
            const unitPrices = {};
            $scope.isLoading = true;

            if ($scope.ticketTypes.free) {
                selectedTickets.push("Miễn phí vé");
            }
            if ($scope.ticketTypes.adult) {
                selectedTickets.push("Vé người lớn");
            }
            if ($scope.ticketTypes.child) {
                selectedTickets.push("Vé trẻ em");
            }
            if ($scope.ticketTypes.adult) {
                unitPrices.adult = $scope.unitPrice.adult;
            }
            if ($scope.ticketTypes.child) {
                unitPrices.child = $scope.unitPrice.child;
            }

            $scope.visitLocation.openingTime = $filter('date')($scope.visitLocation.openingTime, 'HH:mm:ss');
            $scope.visitLocation.closingTime = $filter('date')($scope.visitLocation.closingTime, 'HH:mm:ss');
            $scope.visitLocation.agenciesId = $scope.agencies.id;

            const dataVisit = new FormData();
            dataVisit.append("visitLocationsDto", new Blob([JSON.stringify($scope.visitLocation)], {type: "application/json"}));
            dataVisit.append("visitLocationImage", $scope.visitLocation.visitLocationImage);
            dataVisit.append("selectedTickets", new Blob([JSON.stringify(selectedTickets)], {type: "application/json"}));
            dataVisit.append("unitPrices", new Blob([JSON.stringify(unitPrices)], {type: "application/json"}));

            VisitLocationServiceAG.update(dataVisit).then(function successCallback() {
                $location.path('/business/visit/home');
                centerAlert('Thành công !', 'Thông tin địa điểm tham quan đã được cập nhật thành công.', 'success')
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        confirmAlert('Bạn có chắc chắn muốn cập nhật không ?', confirmUpdate);
    }

    $scope.deleteVisitLocation = function () {
        function confirmDelete() {
            $scope.isLoading = true;

            VisitLocationServiceAG.delete(visitLocationId).then(function successCallback() {
                $location.path('/business/visit/home');
                centerAlert('Thành công !', 'Xóa thông tin địa điểm tham quan thành công.', 'success');
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        confirmAlert('Bạn có chắc chắn muốn xóa không ?', confirmDelete);
    }

    $scope.init();
});
