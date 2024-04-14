travel_app.controller('TripsTourControllerAD',
    function ($scope, $sce, $location, $routeParams, $timeout, TourTripsServiceAD, TourDetailsServiceAD, MapBoxService, FormatDateService, TransportationTypeServiceAD, Base64ObjectService) {
        mapboxgl.accessToken = 'pk.eyJ1IjoicW5odXQxNyIsImEiOiJjbHN5aXk2czMwY2RxMmtwMjMxcGE1NXg4In0.iUd6-sHYnKnhsvvFuuB_bA';
        $scope.isLoading = true;

        // id tour detail mã hóa
        $scope.tourDetailIdEncode = $routeParams.tourDetailId;

        $scope.tourTrips = {
            tourDetailId: Base64ObjectService.decodeObject($scope.tourDetailIdEncode),
            transportationTypeId: null,
            placeName: null,
            placeImage: null,
            placeAddress: null,
            placeCost: null,
            timeGo: null,
            activityInDay: null,
            dayInTrip: null,
        };

        $scope.tourTripsList = []; // Biến để lưu danh sách tours
        $scope.currentPage = 0; // Trang hiện tại
        $scope.pageSize = 5; // Số lượng tours trên mỗi trang

        let tourTripsId = Base64ObjectService.decodeObject($routeParams.tourTripsId);
        let tourDetailId = $scope.tourTrips.tourDetailId;

        $scope.tourName = '';
        $scope.activityInDayTouched = false
        $scope.maxActivityInDay = 1;

        $scope.showActivities = false;

        const errorCallback = () => {
            $location.path('/admin/internal-server-error')
        }

        $scope.setTouched = () => {
            $scope.activityInDayTouched = true;
        };

        $scope.isActive = () => {
            return $scope.activityInDayTouched && ($scope.tourTrips.activityInDay === null || $scope.tourTrips.activityInDay === undefined || $scope.tourTrips.activityInDay === '');
        };

        $scope.canSubmit = () => {
            return $scope.activityInDayTouched && !$scope.isActive();
        };

        $scope.toggleActivities = () => {
            $scope.showActivities = !$scope.showActivities;
        };

        $scope.init = () => {
            TourTripsServiceAD.getAllTrips($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, tourDetailId)
                .then((response) => {
                    if (response.data.data === null || response.data.data.content.length === 0) {
                        $scope.setPage(Math.max(0, $scope.currentPage - 1));
                        return
                    }
                    $scope.tourTripsList = response.data.data.content;
                    $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                    $scope.totalElements = response.data.data.totalElements; // Tổng số phần tử

                    $scope.tourTripsList.forEach((tourTrips) => {
                        tourTrips.activityInDay = $sce.trustAsHtml(tourTrips.activityInDay);
                    });
                }, errorCallback).finally(() => {
                $scope.isLoading = false;
            });

            TransportationTypeServiceAD.getAllTransportationTypes().then((response) => {
                if (response.status === 200) {
                    $scope.transportationType = response.data.data;
                } else {
                    $location.path('admin/page-not-found');
                }
            }, errorCallback);

            if (tourTripsId !== undefined && tourTripsId !== null && tourTripsId !== "") {
                TourTripsServiceAD.findTripsById(tourTripsId).then((response) => {
                    if (response.status === 200) {
                        $timeout(() => {
                            $scope.tourTrips = response.data.data;
                            let timeComponents = $scope.tourTrips.timeGo.split(':');
                            let timeArray = [parseInt(timeComponents[0]), parseInt(timeComponents[1])];
                            $scope.tourTrips.timeGo = FormatDateService.convertStringToTime(timeArray);
                        }, 0);
                    }
                }, errorCallback);
            }
            if (tourDetailId !== undefined && tourTripsId !== null && tourTripsId !== "") {
                TourDetailsServiceAD.findTourDetailById(tourDetailId).then((response) => {
                    $scope.tourName = response.data.data.toursByTourId.tourName;
                }, errorCallback);
            }

            /**
             * Phương thức hiển thị modal
             */
            $scope.showModalMapTourTrips = () => {
                $scope.searchLocation = "";
                let modelMap = $('#modalMapTourTrip');
                modelMap.modal('show');

                modelMap.on('shown.bs.modal', () => {
                    $scope.initMap();
                });
            };

            /**
             * Phương thức khởi tạo map
             */
            $scope.initMap = () => {
                $scope.map = new mapboxgl.Map({
                    container: 'map',
                    style: 'mapbox://styles/mapbox/streets-v12',
                    center: [106.6297, 10.8231],
                    zoom: 10
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

            /**
             * chọn dữ liệu trên form
             * @param location
             */
            $scope.selectLocationTourTrips = (location) => {
                $scope.searchLocation = location;
                $scope.searchLocationOnMapTourTrips();
                $scope.showSuggestions = false;
            }

            /**
             * tìm kiếm vị trí trên bản đồ
             */
            $scope.searchLocationOnMapTourTrips = () => {
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

            /**
             * submit dữ liệu tìm kiếm
             */
            $scope.submitSearchOnMapTourTrips = () => {
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

            /**
             * nhập dữ liệu vào ô input
             * @param toLocation
             */
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
                            $scope.tourTrips.placeAddress = addressComponents.join(',').trim();
                        });
                    })
                    .catch(error => {
                        console.error('Lỗi khi lấy thông tin địa chỉ:', error);
                    });
            }

            /**
             * Phân trang
             * @param page
             */
            $scope.setPage = (page) => {
                if (page >= 0 && page < $scope.totalPages) {
                    $scope.currentPage = page;
                    $scope.init();
                }
            };

            $scope.getPaginationRange = () => {
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

            $scope.pageSizeChanged = () => {
                $scope.currentPage = 0; // Đặt lại về trang đầu tiên
                $scope.init(); // Tải lại dữ liệu với kích thước trang mới
            };

            $scope.getDisplayRange = () => {
                return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
            };

            /**
             * Sắp xếp
             * @param column
             */
            $scope.sortData = (column) => {
                $scope.sortBy = column;
                $scope.sortDir = ($scope.sortDir === 'asc') ? 'desc' : 'asc';
                $scope.init();
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

            /**
             * Upload hình ảnh và lưu vào biến placeImage
             * @param file
             */
            $scope.updatePlaceImage = (file) => {
                if (file && !file.$error) {
                    $scope.tourTrips.placeImage = file;
                }
            };
        };

        /**
         * API create
         */
        $scope.createTourTripsSubmit = () => {
            $scope.isLoading = true;
            const dataTourTrips = new FormData();

            dataTourTrips.append("tourTripsDto", new Blob([JSON.stringify($scope.tourTrips)], {type: "application/json"}));
            dataTourTrips.append('placeImage', $scope.tourTrips.placeImage);
            dataTourTrips.append('timeGo', $scope.tourTrips.timeGo);

            TourTripsServiceAD.createTrips(dataTourTrips).then(() => {
                toastAlert('success', 'Thêm mới thành công !');
                $location.path('/admin/detail-tour-list/trips-tour-list/' + Base64ObjectService.encodeObject($scope.tourTrips.tourDetailId));
            }, errorCallback).finally(() => {
                $scope.isLoading = false;
            });
        };

        /**
         * API update
         */
        $scope.updateTourTripsSubmit = () => {
            const confirmUpdate = () => {
                $scope.isLoading = true;
                let dataTourTrips = new FormData();
                let timeGo = FormatDateService.formatDate($scope.tourTrips.timeGo);

                dataTourTrips.append("tourTripsDto", new Blob([JSON.stringify($scope.tourTrips)], {type: "application/json"}));
                dataTourTrips.append('placeImage', $scope.tourTrips.placeImage);

                TourTripsServiceAD.updateTrips(tourTripsId, dataTourTrips, timeGo).then(() => {
                    toastAlert('success', 'Cập nhật thành công !');
                    $location.path('/admin/detail-tour-list/trips-tour-list/' + Base64ObjectService.encodeObject($scope.tourTrips.tourDetailId));
                }, errorCallback).finally(() => {
                    $scope.isLoading = false;
                });
            }

            confirmAlert('Bạn có chắc chắn muốn cập nhật kế hoạch không ?', confirmUpdate);
        };

        /**
         * API delete
         */
        $scope.deleteTourTrips = (tourTripsId) => {
            const confirmDeleteTour = () => {
                TourTripsServiceAD.deactivateTrips(tourTripsId).then(() => {
                    toastAlert('success', 'Xóa kế hoạch thành công !');
                    $scope.init();
                }, errorCallback);
            }

            confirmAlert('Bạn có chắc chắn muốn xóa kế hoạch không ?', confirmDeleteTour);
        }

        $scope.init();
    });
