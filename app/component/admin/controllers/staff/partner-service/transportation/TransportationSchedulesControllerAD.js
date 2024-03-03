travel_app.controller('TransportationSchedulesControllerAD',
    function ($scope, $sce, $routeParams, $location, $timeout, $http, TransportationBrandServiceAD,
              TransportationTypeServiceAD, TransportationScheduleServiceAD, TourDetailsServiceAD) {
        $scope.isLoading = true;
        $scope.tourDetailId = $routeParams.tourDetailId;
        let tourDetailId = $scope.tourDetailId;

        $scope.transportationSearch = {}

        $scope.showMoreTransportationBrand = false;
        $scope.limitTransportationBrand = 5;

        $scope.showMoreTransportationType = false;
        $scope.limitTransportationType = 5;

        $scope.currentPage = 0;
        $scope.pageSize = 5;

        if (tourDetailId !== undefined && tourDetailId !== null && tourDetailId !== "") {
            TourDetailsServiceAD.findTourDetailById(tourDetailId).then(async response => {
                $scope.tourdetail = await response.data.data;

                $scope.transportationSearch = {
                    fromLocation: $scope.tourdetail.fromLocation,
                    toLocation: $scope.tourdetail.toLocation,
                    departureTime: $scope.tourdetail.departureDate,
                    arrivalTime: $scope.tourdetail.arrivalDate,
                    amountSeat: $scope.tourdetail.numberOfGuests,
                }

                await $scope.getTransportationSchedule();

            })
        }

        $scope.filters = {
            price: 10000000, mediaTypeList: [], listOfVehicleManufacturers: [],
        }

        $scope.ratings = [{id: 1, label: '1 sao'}, {id: 2, label: '2 sao'}, {id: 3, label: '3 sao'}, {
            id: 4,
            label: '4 sao'
        }, {id: 5, label: '5 sao'}];

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
            console.log($scope.transportationScheduleList)
        };

        $scope.getTransportationSchedule = async () => {
            try {
                const [transportationBrandResponse,
                    TransportationTypeResponse,
                    TransportationScheduleResponse,
                    provincesResponse]
                    = await Promise.all([
                    TransportationBrandServiceAD.getAllTransportationBrands(),
                    TransportationTypeServiceAD.getAllTransportationTypes(),
                    TransportationScheduleServiceAD.getAllTransportationSchedules($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.transportationSearch, $scope.filters),
                    $http.get('/lib/address/data.json')]);

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
        $scope.sortData = function (column, sortDir) {

            if (!sortDir) {
                $scope.sortBy = "id";
                $scope.sortDir = "asc";
            } else {
                $scope.sortBy = column;
                $scope.sortDir = sortDir;
            }

            $scope.getTransportationSchedule();
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
                    console.log(response)
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

    });