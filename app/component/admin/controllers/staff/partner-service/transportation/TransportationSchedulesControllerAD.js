travel_app.controller('TransportationSchedulesControllerAD', function ($scope, $sce, $routeParams, $location, $timeout, $http, TransportationBrandServiceAD, TransportationTypeServiceAD, TransportationScheduleServiceAD) {
    $scope.isLoading = true;
    $scope.tourDetailId = $routeParams.tourDetailId;

    $scope.showMoreTransportationBrand = false;
    $scope.limitTransportationBrand = 5;

    $scope.showMoreTransportationType = false;
    $scope.limitTransportationType = 5;

    $scope.currentPage = 0;
    $scope.pageSize = 5;

    $scope.transportationSearch = {
        transportationBrandId: null,
        fromLocation: null,
        toLocation: null,
        departureTime: null,
        arrivalTime: null,
        amountSeat: null,
    }

    $scope.filters = {
        price: 10000000, mediaTypeList: [], listOfVehicleManufacturers: [],
    }

    $scope.ratings = [{id: 1, label: '1 sao'}, {id: 2, label: '2 sao'}, {id: 3, label: '3 sao'}, {
        id: 4,
        label: '4 sao'
    }, {id: 5, label: '5 sao'}];

    $scope.search = () => {
        console.log($scope.transportationSearch)

    }

    // start page
    $scope.setPage = (page) => {
        if (page >= 0 && page < $scope.totalPages) {
            $scope.currentPage = page;
            $scope.getTransportationSchedule();
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
        $scope.getTransportationSchedule();
    };

    $scope.getDisplayRange = () => Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
    //end page

    //data
    $scope.transportationData = (response) => {
        $scope.transportationScheduleList = response.data.data.content;
        $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
        $scope.totalElements = response.data.data.totalElements;
    };

    $scope.getTransportationSchedule = async () => {
        try {
            const [transportationBrandResponse, TransportationTypeResponse, TransportationScheduleResponse, provincesResponse] = await Promise.all([TransportationBrandServiceAD.getAllTransportationBrands(), TransportationTypeServiceAD.getAllTransportationTypes(), TransportationScheduleServiceAD.getAllTransportationSchedules($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir), $http.get('/lib/address/data.json')]);

            $scope.transportationBrandList = transportationBrandResponse.data.data;
            $scope.transportationTypeList = TransportationTypeResponse.data.data;

            $scope.transportationData(TransportationScheduleResponse)

            $scope.provinces = provincesResponse.data;

        } catch (error) {
            console.error("Error:", error);
        } finally {
            $scope.$apply(() => {
                $scope.isLoading = false;
            });
        }
    }

    //show tiện ích
    $scope.showMoreItemsTransportationBrand = function () {
        $scope.limitTransportationBrand = $scope.transportationBrandList.length;
        $scope.showMoreTransportationBrand = true;
    };

    $scope.showLessItemsTransportationBrand = function () {
        $scope.limitTransportationBrand = 5;
        $scope.showMoreTransportationBrand = false;
    };

    $scope.showMoreItemsTransportationType = function () {
        $scope.limitTransportationType = $scope.transportationTypeList.length;
        $scope.showMoreTransportationType = true;
    };

    $scope.showLessItemsTransportationType = function () {
        $scope.limitTransportationType = 5;
        $scope.showMoreTransportationType = false;
    };

    //sắp xếp
    $scope.sortData = (column) => {
        $scope.sortBy = column;
        $scope.sortDir = ($scope.sortDir === 'asc') ? 'desc' : 'asc';
        $scope.getHotelServiceList();
    };

    $scope.getSortIcon = (column) => {
        if ($scope.sortBy === column) {
            return $sce.trustAsHtml($scope.sortDir === 'asc' ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M182.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"/></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l-128 128z"/></svg>');
        }
        return $sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z"/></svg>');
    };

    //thêm danh sách lọc
    $scope.ChooseFromAVarietyOfVehicles = function (id) {
        let index = $scope.filters.mediaTypeList.indexOf(id);
        if (index === -1) {
            $scope.filters.mediaTypeList.push(id);
        } else {
            $scope.filters.mediaTypeList.splice(index, 1);
        }
    };

    $scope.ChooseFromManyCarBrands = function (id) {
        let index = $scope.filters.listOfVehicleManufacturers.indexOf(id);
        if (index === -1) {
            $scope.filters.listOfVehicleManufacturers.push(id);
        } else {
            $scope.filters.listOfVehicleManufacturers.splice(index, 1);
        }
    };

    $scope.filterAllMedia = function () {
        TransportationScheduleServiceAD.getAllTransportationSchedules($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.transportationSearch, $scope.filters)
            .then(function successCallback(response) {
                console.log(response.data.status)
                $scope.transportationData(response)
                if (response.data.status === '204') {
                    toastAlert('warning', 'Không tìm thấy dữ liệu !');
                }
            }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    }

    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    $scope.getTransportationSchedule();

});