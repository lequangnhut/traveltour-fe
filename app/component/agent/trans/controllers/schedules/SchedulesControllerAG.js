travel_app.controller('SchedulesControllerAG',
    function ($scope, $timeout, $sce, $filter, $location, $routeParams, $http, LocalStorageService, Base64ObjectService, TransportationScheduleServiceAD, SchedulesServiceAG, TransportServiceAG, MapBoxService) {
        mapboxgl.accessToken = 'pk.eyJ1IjoicW5odXQxNyIsImEiOiJjbHN5aXk2czMwY2RxMmtwMjMxcGE1NXg4In0.iUd6-sHYnKnhsvvFuuB_bA';

        let searchTimeout;
        let brandId = LocalStorageService.get('brandId');
        let scheduleId = Base64ObjectService.decodeObject($routeParams.id);
        let tourDetail = LocalStorageService.decryptLocalData('tourDetail', 'encryptTourDetail');

        $scope.dateError = null;

        $scope.transportationList = {};
        $scope.provinces = [];

        $scope.isLoading = true;

        $scope.tripType = false;
        $scope.currentTab = LocalStorageService.get('currentTabSchedules') || 'permanent';
        $scope.currentPage = 0;
        $scope.pageSize = 5;

        $scope.inputStatus = {
            transportationId: false,
            departureTime: false,
            arrivalTime: false
        };

        $scope.schedules = {
            id: null,
            transportationId: null,
            fromLocation: null,
            toLocation: null,
            fromAddress: tourDetail ? tourDetail.fromLocation : null,
            toAddress: tourDetail ? tourDetail.toLocation : null,
            departureTime: tourDetail ? new Date(tourDetail.departureDate) : null,
            arrivalTime: tourDetail ? new Date(tourDetail.arrivalDate) : null,
            unitPrice: null,
            priceFormat: null,
            bookedSeat: null,
            tripType: null,
            dateCreated: null,
            isActive: null,
            isStatus: null,
            scheduleNote: null
        };

        function errorCallback() {
            $location.path('/admin/internal-server-error')
        }

        $scope.validateDates = function () {
            const start = new Date($scope.schedules.departureTime);
            const end = new Date($scope.schedules.arrivalTime);
            const now = new Date();

            // Kiểm tra nếu ngày / giờ về phải trước ngày / giờ đi
            if (start >= end) {
                $scope.form_trips.arrivalTime.$setValidity('dateRange', false);
            } else {
                $scope.form_trips.arrivalTime.$setValidity('dateRange', true);
            }

            // Kiểm tra nếu ngày / giờ đi là ngày / giờ quá khứ
            if (start <= now) {
                $scope.form_trips.departureTime.$setValidity('futureDate', false);
            } else {
                $scope.form_trips.departureTime.$setValidity('futureDate', true);
            }
        };

        $scope.$watch('schedules.departureTime', function () {
            $scope.validateDates();
        });

        $scope.$watch('schedules.arrivalTime', function () {
            $scope.validateDates();
        });

        /**
         * API lấy dữ liệu tỉnh thành và fill dữ liệu lên select
         */
        $http.get('/lib/address/data.json').then(function (response) {
            $scope.provinces = response.data;
        });

        /**
         * Hàm kiểm tra sự trùng lặp giữa điểm đi và điểm đến
         * @returns {boolean}
         */
        function hasDuplicateSelection() {
            return $scope.schedules.fromLocation === $scope.schedules.toLocation;
        }

        /**
         * Hàm kiểm tra sự trùng lặp giữa điểm đi và điểm đến
         */
        $scope.updateToLocation = function () {
            if (hasDuplicateSelection()) {
                $scope.schedules.toLocation = null;
                $scope.toLocationError = true;
            } else {
                $scope.toLocationError = false;
            }

            $scope.filteredProvinces = $scope.provinces.filter(function (city) {
                return city.Name !== $scope.schedules.fromLocation;
            });
        };

        /**
         * Hàm kiểm tra trùng lặp giờ di chuyển
         */
        $scope.checkDuplicateTransportSchedule = function () {
            if ($scope.inputStatus.transportationId && $scope.inputStatus.departureTime && $scope.inputStatus.arrivalTime) {
                let transportationId = $scope.schedules.transportationId;
                let departureTime = new Date($scope.schedules.departureTime).toISOString();
                let arrivalTime = new Date($scope.schedules.arrivalTime).toISOString();

                SchedulesServiceAG.checkDuplicateSchedule(transportationId, departureTime, arrivalTime).then(function (response) {
                    if (response.status === 200) {
                        $scope.dateError = response.data.data.exists;
                        $scope.returnDate = response.data.data.returnDate;
                    } else {
                        $location.path('/admin/page-not-found');
                    }
                }, errorCallback).finally(function () {
                    $scope.isLoading = false;
                });
            }
        }

        $scope.onTransportationIdChange = function () {
            $scope.inputStatus.transportationId = !!$scope.schedules.transportationId;
            $scope.checkDuplicateTransportSchedule();
        }

        $scope.onDepartureTimeChange = function () {
            $scope.inputStatus.departureTime = !!$scope.schedules.departureTime;
            $scope.checkDuplicateTransportSchedule();
        }

        $scope.onArrivalTimeChange = function () {
            $scope.inputStatus.arrivalTime = !!$scope.schedules.arrivalTime;
            $scope.checkDuplicateTransportSchedule();
        }

        /**
         * Phương thức chuyển đổi tab
         * @param tab
         * @param tripType
         */
        $scope.changeTab = (tab, tripType) => {
            $scope.currentTab = tab;
            $scope.tripType = tripType;
            $scope.init();
            LocalStorageService.set('currentTabSchedules', tab);
        };

        if ($scope.currentTab === 'contract') {
            $scope.changeTab('contract', true);
        } else {
            $scope.changeTab('permanent', false);
        }

        $scope.init = function () {
            /**
             * Tìm tất cả chuyến xe bằng loại xe (tripType)
             */
            $scope.isLoading = true;

            SchedulesServiceAG.findAllByTripType(brandId, $scope.tripType, $scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir).then(function (response) {
                if (response.status === 200) {
                    $scope.transportationScheduleList = response.data.data.content;
                    $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                    $scope.totalElements = response.data.data.totalElements;

                    response.data.data.content.forEach(transportation => {
                        $scope.findTransportation(transportation.transportationId);
                    });
                } else {
                    $location.path('/admin/page-not-found');
                }
            }).finally(function () {
                $scope.isLoading = false;
            });

            /**
             * Tìm kiếm
             */
            $scope.searchTransportationSchedules = function () {
                if (searchTimeout) $timeout.cancel(searchTimeout);

                searchTimeout = $timeout(function () {
                    SchedulesServiceAG.findAllSchedules(brandId, $scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.searchTerm)
                        .then(function (response) {
                            $scope.transportationScheduleList = response.data.content;
                            $scope.totalPages = Math.ceil(response.data.totalElements / $scope.pageSize);
                            $scope.totalElements = response.data.totalElements;
                        }, errorCallback).finally(function () {
                        $scope.isLoading = false;
                    });
                }, 500);
            };

            /**
             * Tìm tất cả phương tiện bằng brandId
             * @param brandId
             */
            SchedulesServiceAG.findAllScheduleByTransportId(brandId).then(function (response) {
                if (response.status === 200) {
                    $scope.transportations = response.data.data;
                } else {
                    $location.path('/admin/page-not-found');
                }
            }, errorCallback);

            /**
             * Tìm biển số xe bằng transportId
             * @param transportId
             */
            $scope.findTransportation = function (transportId) {
                if (!$scope.transportationList[transportId]) {
                    SchedulesServiceAG.findTransportByTransportId(transportId).then(function (response) {
                        $scope.transportationList[transportId] = response.data.data;
                    }, errorCallback);
                }
            }

            /**
             * Tìm tên thương hiệu phương tiện bằng brandId
             * @param transportTypeId
             */
            TransportServiceAG.findByTransportBrandId(brandId).then(function (response) {
                if (response.status === 200) {
                    $scope.transportBrand = response.data.data;
                } else {
                    $location.path('/admin/page-not-found');
                }
            }, errorCallback);

            if (scheduleId !== undefined && scheduleId !== null && scheduleId !== "") {
                SchedulesServiceAG.findByScheduleId(scheduleId).then(function successCallback(response) {
                    if (response.status === 200) {
                        $scope.schedules = response.data.data.schedules;
                        $scope.schedules.departureTime = new Date($scope.schedules.departureTime);
                        $scope.schedules.arrivalTime = new Date($scope.schedules.arrivalTime);
                        $scope.schedules.priceFormat = response.data.data.price;
                    } else {
                        $location.path('/admin/page-not-found');
                    }
                }, errorCallback);
            }

            /**
             * Modal xem thông tin chi tiết của chuyến đi
             */
            $scope.modalDetailSchedule = function (transportationId, transportationScheduleId) {
                $('#modal-schedule-detail').modal('show');
                $scope.transportation = {};
                $scope.transportUtilityModal = [];

                if (transportationId !== undefined && transportationId !== null && transportationId !== "") {
                    TransportServiceAG.findByTransportId(transportationId).then(function successCallback(response) {
                        if (response.status === 200) {
                            $scope.transportation = response.data.data.transportGetDataDto;
                            $scope.transportUtilAPI = response.data.data.transportUtilities;
                            $scope.transportationImages = response.data.data.transportGetDataDto.transportationImagesById;
                            $scope.transportBrand = response.data.data.transportGetDataDto.transportationBrandsByTransportationBrandId;
                            $scope.transportType = response.data.data.transportGetDataDto.transportationTypesByTransportationTypeId;

                            $scope.transportUtilAPI.some(function (utilId) {
                                TransportServiceAG.findByTransportUtilityId(utilId).then(function (response) {
                                    if (response.status === 200) {
                                        $scope.transportUtilityModal.push(response.data.data)
                                    } else {
                                        $location.path('/admin/page-not-found');
                                    }
                                });
                            });
                        } else {
                            $location.path('/admin/page-not-found');
                        }
                    });
                }

                if (transportationScheduleId !== undefined && transportationScheduleId !== null && transportationScheduleId !== "") {
                    TransportationScheduleServiceAD.findById(transportationScheduleId).then(function (response) {
                        if (response.status === 200) {
                            $scope.transportationSchedule = response.data.data;
                        } else {
                            $location.path('/admin/page-not-found');
                        }
                    });
                }
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

        $scope.getDisplayIndex = function (index) {
            return index + 1 + $scope.currentPage * $scope.pageSize;
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

        /**
         * Gọi api create
         */
        $scope.createSchedule = function () {
            $scope.isLoading = true;
            $scope.schedules.departureTime = new Date($scope.schedules.departureTime).toISOString();
            $scope.schedules.arrivalTime = new Date($scope.schedules.arrivalTime).toISOString();

            let transportationSchedulesDto = $scope.schedules;

            SchedulesServiceAG.create(transportationSchedulesDto).then(function () {
                $location.path('/business/transport/schedules-management');
                toastAlert('success', 'Thêm mới thành công !');
                LocalStorageService.remove('tourDetail');
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        /**
         * Gọi api update
         */
        function confirmUpdate() {
            $scope.isLoading = true;
            $scope.schedules.departureTime = new Date($scope.schedules.departureTime).toISOString();
            $scope.schedules.arrivalTime = new Date($scope.schedules.arrivalTime).toISOString();

            let transportationSchedulesDto = $scope.schedules;

            SchedulesServiceAG.update(transportationSchedulesDto).then(function () {
                $location.path('/business/transport/schedules-management');
                toastAlert('success', 'Cập nhật thành công !');
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        $scope.updateSchedule = function () {
            confirmAlert('Bạn có chắc chắn muốn cập nhật không ?', confirmUpdate);
        }

        /**
         * Gọi api delete
         */
        $scope.deleteSchedule = function (scheduleId, fromLocation, toLocation) {
            function confirmDelete() {
                SchedulesServiceAG.delete(scheduleId).then(function () {
                    $location.path('/business/transport/schedules-management');
                    toastAlert('success', 'Xóa chuyến đi thành công !');
                    $('#modal-schedule-detail').modal('hide');
                    $scope.init();
                }, errorCallback).finally(function () {
                    $scope.isLoading = false;
                });
            }

            confirmAlert('Bạn có chắc chắn muốn xóa chuyến đi từ '
                + fromLocation + ' đến ' + toLocation + ' không ?', confirmDelete);
        }

        $scope.init();

        $scope.initMap = () => {
            $scope.map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [106.6297, 10.8231],
                zoom: 9
            });

            $scope.map.on('load', () => {
                $scope.map.on('click', (e) => {
                    $scope.longitude = e.lngLat.lng;
                    $scope.latitude = e.lngLat.lat;

                    if ($scope.currentMarker) {
                        $scope.currentMarker.remove();
                    }

                    $scope.toLocationArray = [$scope.longitude, $scope.latitude];

                    $scope.showLocationOnInput($scope.toLocationArray);

                    $scope.currentMarker = new mapboxgl.Marker()
                        .setLngLat([$scope.longitude, $scope.latitude])
                        .addTo($scope.map);
                });
            });
        }

        $scope.searchLocationOnMap = () => {
            let searchQuery = encodeURIComponent($scope.searchLocation);

            if (searchQuery) {
                let apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery}.json?access_token=${mapboxgl.accessToken}&country=VN&type=region&autocomplete=true`;

                fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => {
                        if (data.features.length > 0) {
                            $scope.suggestedLocations = data.features.map(feature => feature.place_name);
                            $scope.showSuggestions = true;
                        } else {
                            $scope.showSuggestions = false;
                        }
                    })
                    .catch(error => {
                        console.error('Lỗi khi tìm kiếm địa điểm:', error);
                        $scope.showSuggestions = false;
                    });
            } else {
                $scope.showSuggestions = false;
                $scope.initMap();
            }
        }

        $scope.selectLocation = (location) => {
            $scope.searchLocation = location;
            $scope.searchLocationOnMap();
            $scope.showSuggestions = false;
        }

        $scope.submitSearchOnMap = () => {
            $scope.showSuggestions = false;
            let searchQuery = $scope.searchLocation;

            if (searchQuery) {
                if (searchQuery.length > 50) {
                    searchQuery = searchQuery.substring(0, 50);
                }

                let relatedKeywords = searchQuery.split(' ').filter(keyword => keyword.length > 2);
                searchQuery = relatedKeywords.join(' ');

                MapBoxService.geocodeAddress(searchQuery, (error, coordinates) => {
                    if (error) {
                        console.error('Lỗi khi tìm kiếm địa điểm:', error);
                        return;
                    }

                    let bbox = [
                        [coordinates[0] - 0.01, coordinates[1] - 0.01],
                        [coordinates[0] + 0.01, coordinates[1] + 0.01]
                    ];

                    $scope.map ? $scope.map.fitBounds(bbox) : $scope.initMap();
                });
            } else {
                $scope.initMap();
            }
        }

        $scope.showLocationOnInput = (toLocation) => {
            fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${toLocation[0]},${toLocation[1]}.json?access_token=${mapboxgl.accessToken}`)
                .then(response => response.json())
                .then(data => {
                    $scope.$apply(() => {
                        let addressComponents = data.features[0].place_name.split(',');
                        for (let i = addressComponents.length - 1; i >= 0; i--) {
                            let lastPart = addressComponents[i].trim();
                            if (!isNaN(lastPart)) {
                                addressComponents.splice(i, 1);
                                break;
                            }
                        }

                        if ($scope.currentInput === 'fromAddress') {
                            $scope.schedules.fromAddress = addressComponents.join(',').trim();
                        } else if ($scope.currentInput === 'toAddress') {
                            $scope.schedules.toAddress = addressComponents.join(',').trim();
                        }
                    });
                })
                .catch(error => {
                    console.error('Lỗi khi lấy thông tin địa chỉ:', error);
                });
        }

        /**
         * Phương thức hiển thị modal
         */
        $scope.showModalMap = (inputName) => {
            $scope.currentInput = inputName;
            $scope.searchLocation = "";
            let modelMap = $('#modalMapTransport');
            modelMap.modal('show');

            modelMap.on('shown.bs.modal', () => {
                $scope.initMap();
            });
        };
    });
