travel_app.controller('RequestCarControllerAG',
    function ($scope, $location, $timeout, $window, $filter, $routeParams, RequestCarServiceAD, TransportationBrandServiceAD, TransportationTypeServiceAD, RequestCarServiceAG, TransportServiceAG, LocalStorageService, Base64ObjectService, TourDetailsServiceAD, MapBoxService) {
        mapboxgl.accessToken = 'pk.eyJ1IjoicW5odXQxNyIsImEiOiJjbHN5aXk2czMwY2RxMmtwMjMxcGE1NXg4In0.iUd6-sHYnKnhsvvFuuB_bA';

        $scope.brandId = LocalStorageService.get('brandId');
        $scope.tourDetailId = Base64ObjectService.decodeObject($routeParams.tourDetailId);

        $scope.currentPage = 0; // Trang hiện tại
        $scope.pageSize = 10; // Số lượng tours trên mỗi trang

        $scope.playerLineDrawn = false; // biến kiểm tra xem đã vẽ player line chưa

        $scope.markersTour = [];

        $scope.showMoreTransportationBrand = false;
        $scope.limitTransportationBrand = 5;

        $scope.showMoreTransportationType = false;
        $scope.limitTransportationType = 5;


        $scope.ratings = [
            {id: 1, label: 'Trên 1 sao'},
            {id: 2, label: 'Trên 2 sao'},
            {id: 3, label: 'Trên 3 sao'},
            {id: 4, label: 'Trên 4 sao'},
            {id: 5, label: 'Trên 5 sao'}
        ];

        $scope.filters = {
            fromLocation: null,
            toLocation: null,
            mediaTypeList: [],
            listOfVehicleManufacturers: [],
            seatTypeList: [],
        };

        $scope.validateDates = (day) => {
            $scope.currentDate = new Date();

            let currentDateNow = Math.floor((day - $scope.currentDate) / (1000 * 60 * 60 * 24))

            if (currentDateNow < -1) {
                $scope.errorCheckInDateFiller = "Ngày đi không thể nhỏ hơn ngày hiện tại";
            } else {
                $scope.errorCheckInDateFiller = "";
            }
        };

        $scope.getCurrentDate = () => {
            let currentDate = new Date();
            const year = currentDate.getFullYear();
            let month = currentDate.getMonth() + 1;
            let day = currentDate.getDate();

            if (month < 10) {
                month = '0' + month;
            }
            if (day < 10) {
                day = '0' + day;
            }

            return year + '-' + month + '-' + day;
        };

        $scope.checkDate = () => {
            const currentDate = new Date();
            if ($scope.filters.departure === undefined) {
                $scope.filters.departure = currentDate;
                toastAlert('warning', 'Không được nhập ngày quá khứ!');
            }
        };

        //show tiện ích
        $scope.showMoreItemsTransportationBrand = () => {
            $scope.limitTransportationBrand = $scope.transportationBrandList.length;
            $scope.showMoreTransportationBrand = true;
        };

        $scope.showLessItemsTransportationBrand = () => {
            $scope.limitTransportationBrand = 5;
            $scope.showMoreTransportationBrand = false;
        };

        $scope.showMoreItemsTransportationType = () => {
            $scope.limitTransportationType = $scope.transportationTypeList.length;
            $scope.showMoreTransportationType = true;
        };

        $scope.showLessItemsTransportationType = () => {
            $scope.limitTransportationType = 5;
            $scope.showMoreTransportationType = false;
        };

        //thêm danh sách lọc
        $scope.ChooseFromAVarietyOfVehicles = (id) => {
            let index = $scope.filters.mediaTypeList.indexOf(id);
            if (index === -1) {
                $scope.filters.mediaTypeList.push(id);
            } else {
                $scope.filters.mediaTypeList.splice(index, 1);
            }
        };

        $scope.ChooseFromManyCarBrands = (id) => {
            let index = $scope.filters.listOfVehicleManufacturers.indexOf(id);
            if (index === -1) {
                $scope.filters.listOfVehicleManufacturers.push(id);
            } else {
                $scope.filters.listOfVehicleManufacturers.splice(index, 1);
            }
        };

        $scope.chooseFromSeatingType = (id) => {
            let index = $scope.filters.seatTypeList.indexOf(id);
            if (index === -1) {
                $scope.filters.seatTypeList.push(id);
            } else {
                $scope.filters.seatTypeList.splice(index, 1);
            }
        };

        const fetchData = (serviceFunc, successCallback) => {
            return serviceFunc().then((response) => {
                if (response.status === 200) {
                    successCallback(response.data.data);
                } else {
                    $location.path('/admin/page-not-found');
                }
            });
        }

        //loc
        $scope.filterAllMedia = () => {
            RequestCarServiceAD.findAllRequestCarFilters($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.filters)
                .then((response) => {
                    $scope.requestCarList = response.data.data !== null ? response.data.data.content : [];
                    $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                }).finally(() => {
                $scope.isLoading = false;
            });
        }

        $scope.init = function () {
            $scope.isLoading = true;

            Promise.all([fetchData(TransportationBrandServiceAD.getAllTransportationBrands, (repo) => {
                $scope.transportationBrandList = repo;
            }), fetchData(TransportationTypeServiceAD.getAllTransportationTypes, (repo) => {
                $scope.transportationTypeList = repo;
            })]).finally(() => {
            });

            /**
             * Danh sách tất cả hồ sơ ứng tuyển
             */
            RequestCarServiceAG.findAllRequestCarServiceAgent($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir).then(function (response) {
                if (response.status === 200) {
                    if (response.data.data === null || response.data.data.content.length === 0) {
                        $scope.setPage(Math.max(0, $scope.currentPage - 1));
                        return
                    }

                    $scope.requestCarList = response.data.data.content;
                    $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                    $scope.totalElements = response.data.data.totalElements; // Tổng số phần tử

                    $scope.requestCarList.forEach(function (requestCar) {
                        $scope.checkTransportBrandSubmitted(requestCar);
                    })
                } else {
                    $location.path('/admin/page-not-found');
                }
            }).finally(function () {
                $scope.isLoading = false;
            });

            /**
             * Xét điều kiện xem có nộp yêu cầu chưa
             * @param requestCar
             */
            $scope.checkTransportBrandSubmitted = function (requestCar) {
                let requestCarId = requestCar.id;
                let transportBrandId = $scope.brandId;

                RequestCarServiceAG.findRequestCarSubmittedServiceAgent(requestCarId, transportBrandId).then(function (response) {
                    if (response.status === 200) {
                        requestCar.isSubmiited = response.data.data;
                    } else {
                        $location.path('/admin/page-not-found');
                    }
                });
            }

            /**
             * Tìm tên thương hiệu phương tiện bằng brandId
             * @param transportTypeId
             */
            TransportServiceAG.findByTransportBrandId($scope.brandId).then(function (response) {
                if (response.status === 200) {
                    $scope.transportBrand = response.data.data;
                } else {
                    $location.path('/admin/page-not-found');
                }
            });

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
        }

        $scope.init();

        /**
         * Khởi tạo map
         */
        $scope.initMap = () => {
            $scope.map = new mapboxgl.Map({
                container: 'map', style: 'mapbox://styles/mapbox/streets-v12', center: [106.6297, 10.8231], zoom: 9
            });

            $scope.map.on('load', () => {
                $scope.map.on('dblclick', (e) => {
                    if (!$scope.playerLineDrawn) {
                        e.preventDefault();

                        let iconUrl = '/assets/customers/images/icon/maker.png';
                        let el = document.createElement('div');
                        el.className = 'marker';
                        el.style.backgroundImage = `url(${iconUrl})`;
                        el.style.width = '40px';
                        el.style.height = '40px';
                        el.style.backgroundSize = '100%';

                        $scope.longitude = e.lngLat.lng;
                        $scope.latitude = e.lngLat.lat;

                        if ($scope.currentMarker) {
                            $scope.currentMarker.remove();
                        }

                        $scope.toLocationArray = [$scope.longitude, $scope.latitude];

                        $scope.currentMarker = new mapboxgl.Marker(el)
                            .setLngLat([$scope.longitude, $scope.latitude])
                            .addTo($scope.map);

                        LocalStorageService.set('destinationLngLat', e.lngLat)
                    } else {
                        e.preventDefault();
                        centerAlert("Có lỗi !", 'Vui lòng nhấn làm mới để chọn điểm tiếp theo. Cảm ơn bạn !', 'warning');
                    }
                });
            });
        }

        /**
         * Tìm địa điểm gợi ý theo input nhập vào
         */
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

        /**
         * chọn địa điểm trong ô gợi ý tìm kiếm
         * @param location
         */
        $scope.selectLocation = (location) => {
            $scope.searchLocation = location;
            $scope.searchLocationOnMap();
            $scope.showSuggestions = false;
        }

        /**
         * Phương thức thêm điểm check trên bản đồ
         * @param tourDetail
         */
        $scope.addMarkersToLocation = function (tourDetail) {
            let bounds = new mapboxgl.LngLatBounds();

            let iconUrl = '/assets/customers/images/icon/maker.png';
            let el = document.createElement('div');
            el.className = 'marker';
            el.style.backgroundImage = `url(${iconUrl})`;
            el.style.width = '40px';
            el.style.height = '40px';
            el.style.backgroundSize = '100%';

            let popup = new mapboxgl.Popup({
                offset: 15,
                closeButton: true,
                closeOnClick: false,
                closeOnClickOutside: true,
                maxWidth: '800px',
                minWidth: '600px'
            }).setHTML('Vị trí điểm đến trên bản đồ');

            MapBoxService.geocodeAddress(tourDetail.toLocation, function (error, toCoordinates) {
                if (!error) {
                    let marker = new mapboxgl.Marker(el)
                        .setLngLat(toCoordinates)
                        .setPopup(popup)
                        .addTo($scope.map);

                    $scope.removeMarkersToLocation();
                    $scope.markersTour.push(marker);

                    bounds.extend(toCoordinates);
                    $scope.map.fitBounds(bounds, {padding: 20});
                } else {
                    console.error("Lỗi khi lấy tọa độ của điểm đến:", error);
                }
            });
        };

        /**
         * Phương thức xóa marker trên bản đồ dựa vào id phòng khách sạn
         */
        $scope.removeMarkersToLocation = function () {
            if ($scope.markersTour.length > 0) {
                $scope.markersTour.forEach(function (marker) {
                    marker.remove();
                });

                $scope.markersTour = [];
            }
        };

        /**
         * hàm để submit tìm kiếm địa điểm
         */
        $scope.submitSearchOnMap = () => {
            LocalStorageService.remove('destinationLngLat');
            $scope.addMarkersToLocation($scope.tourDetail);

            $scope.playerLineDrawn = false;
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

                    let bbox = [[coordinates[0] - 0.01, coordinates[1] - 0.01], [coordinates[0] + 0.01, coordinates[1] + 0.01]];

                    $scope.map ? $scope.map.fitBounds(bbox) : $scope.initMap();
                });
            } else {
                $scope.initMap();
            }
        }

        /**
         * Phương thức vẽ lịch trình từ điểm nhà xe đến điểm đến của tour
         */
        $scope.callAPIMapBoxCalculatorKm = () => {
            let fromLocation = LocalStorageService.get('destinationLngLat');

            if (!fromLocation) {
                centerAlert("Có lỗi !", 'Vui lòng chọn địa điểm trước khi tính toán quãng đường đi.', 'warning');
                $scope.playerLineDrawn = false;
                return;
            } else {
                $scope.playerLineDrawn = true;
            }

            MapBoxService.geocodeAddress($scope.tourDetail.toLocation, function (error, toCoordinates) {
                if (!error) {
                    let origin = toCoordinates;
                    let destination = [fromLocation.lng, fromLocation.lat];
                    let directionsRequest = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=geojson&steps=true&access_token=${mapboxgl.accessToken}`;

                    // Gửi yêu cầu định tuyến
                    fetch(directionsRequest)
                        .then(response => response.json())
                        .then(data => {
                            // Lấy dữ liệu về đường đi
                            let route = data.routes[0].geometry;
                            // Tính toán tổng số km
                            let totalDistance = (data.routes[0].distance / 1000).toFixed(2);

                            function redirectScheduleCreate() {
                                // set tour detail để tạo lịch trình
                                LocalStorageService.encryptLocalData($scope.tourDetail, 'tourDetail', 'encryptTourDetail');
                                LocalStorageService.set('currentTabSchedules', 'contract');
                                $window.location.href = '/business/transport/schedules-management/create-schedules';
                                $scope.setActiveNavItem('trips-list');
                            }

                            // Hiển thị cửa sổ cảnh báo với tổng số km
                            confirmAlert(`Tổng quãng đường đi dự kiến khoảng ${totalDistance} km. Bạn có muốn tạo lịch trình cho tour này không ?`, redirectScheduleCreate);

                            // Vẽ đường đi trên bản đồ
                            $scope.map.addLayer({
                                'id': 'route',
                                'type': 'line',
                                'source': {
                                    'type': 'geojson',
                                    'data': {
                                        'type': 'Feature',
                                        'properties': {},
                                        'geometry': route
                                    }
                                },
                                'layout': {
                                    'line-join': 'round',
                                    'line-cap': 'round'
                                },
                                'paint': {
                                    'line-color': '#e35050',
                                    'line-width': 3
                                }
                            });
                        })
                        .catch(error => {
                            console.error('Lỗi khi lấy thông tin định tuyến:', error);
                        });
                } else {
                    console.error("Lỗi khi lấy tọa độ của điểm đến:", error);
                }
            });
        }

        /**
         * Phương thức hiển thị modal
         */
        $scope.showModalMapRequestCar = (tourDetailId) => {
            $scope.playerLineDrawn = false;
            $scope.searchLocation = "";
            let modelMap = $('#modalMapTransport');
            modelMap.modal('show');

            modelMap.on('shown.bs.modal', () => {
                $scope.initMap();

                /**
                 * Tìm tour detail bằng tour detail id
                 */
                TourDetailsServiceAD.findTourDetailById(tourDetailId).then(function (response) {
                    if (response.status === 200) {
                        $scope.tourDetail = response.data.data;
                        $scope.addMarkersToLocation($scope.tourDetail);
                    } else {
                        $location.path('/admin/page-not-found');
                    }
                });
            });
        };

        /**
         * Phương thức đóng modal
         */
        $scope.closeModalMapRequestCar = () => {
            $scope.removeMarkersToLocation();
            $scope.playerLineDrawn = false;
            let modelMap = $('#modalMapTransport');
            modelMap.modal('hide');
        };
    });