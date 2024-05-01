travel_app.controller('TourDetailCusController',
    function ($scope, $location, $sce, $timeout, $filter, $routeParams, $window, LocalStorageService, UserLikeService, UserCommentsService, RoomTypeServiceCT, AuthService, TourTripsServiceAD, TourDetailsServiceAD, TourDetailCusService, MapBoxService, ToursServiceAD, Base64ObjectService) {
        let user = null
        user = AuthService.getUser();

        mapboxgl.accessToken = 'pk.eyJ1IjoicW5odXQxNyIsImEiOiJjbHN5aXk2czMwY2RxMmtwMjMxcGE1NXg4In0.iUd6-sHYnKnhsvvFuuB_bA';

        $scope.markerTrips = [];
        $scope.coordinateTrips = [];

        $scope.provinceData = [];

        $scope.selectedDayTrip = 1;
        $scope.mapLineLayerId = null;

        $scope.size = null;
        $scope.page = null;

        $scope.adultsMax = 999;
        $scope.childrenMax = 999;

        $scope.ticket = {
            adults: 1,
            children: 0,
            baby: 0
        }

        $scope.isIntegerCheck = true;
        $scope.roundingStars = 0.0;

        const tourDetailId = Base64ObjectService.decodeObject($routeParams.id);

        //input

        $scope.onQuantityBlurAdult = (ticket) => {
            if (ticket.adults === null || ticket.adults === '' || ticket.adults < 1) {
                ticket.adults = 1;
            }
            $scope.updateTotalPrice();
        };

        $scope.onQuantityBlurChildren = (ticket) => {
            if (ticket.children === null || ticket.children === '' || ticket.children < 1) {
                ticket.children = 0;
            }
            $scope.updateTotalPrice();
        };

        function errorCallback() {
            $location.path('/admin/internal-server-error')
        }

        $scope.init = function () {
            var toLocation;
            $scope.isLoading = true;
            $scope.dataLoaded = false;

            /**
             * Tìm tất cả dữ liệu
             */
            TourDetailCusService.findByTourDetailId(tourDetailId).then(function (response) {
                if (response.status === 200) {
                    $scope.tourDetail = response.data.data;
                    toLocation = $scope.tourDetail.toLocation;
                    $scope.tourDetailImagesById = response.data.data.tourDetailImagesById;
                    $scope.tourDetailDescription = $sce.trustAsHtml($scope.tourDetail.tourDetailDescription);

                    let departureDate = new Date($scope.tourDetail.departureDate);
                    let arrivalDate = new Date($scope.tourDetail.arrivalDate);

                    $scope.tourDetail.numberOfDays = Math.ceil((arrivalDate - departureDate) / (1000 * 60 * 60 * 24));
                    $scope.checkIsLikeTour($scope.tourDetail.toursByTourId.id)
                    $scope.initMapSchedules();
                    $scope.updateTotalPrice();
                    $scope.findUserComments($scope.tourDetail.toursByTourId.id)
                } else {
                    $location.path('/admin/page-not-found')
                }
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
                $timeout(function () {
                    $scope.tourDetail.toLocation = toLocation;
                    $scope.dataLoaded = true;
                });
            });

            /**
             * Top 5 tour nổi bật
             */
            TourDetailCusService.findAllTourTrend().then(function (response) {
                if (response.status === 200) {
                    $scope.tourTrendData = response.data.data.map(function (item) {
                        return {
                            tourId: item[0],
                            tourName: item[1],
                            tourImg: item[2],
                            unitPrice: item[3],
                            tourDetailCount: item[4]
                        };
                    });
                } else {
                    $location.path('/admin/page-not-found')
                }
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });

            /**
             * phương thức update giá khi người dùng chọn số lượng
             */
            $scope.updateTotalPrice = function () {
                let unitPrice = $scope.tourDetail.unitPrice;
                let amountAdults = $scope.ticket.adults;
                let amountChildren = $scope.ticket.children;
                $scope.remainingTickets = $scope.tourDetail.numberOfGuests - $scope.tourDetail.bookedSeat;

                $scope.adultsMax = $scope.remainingTickets - amountChildren; // Số vé người lớn tối đa là số vé còn lại trừ đi số vé trẻ em đã chọn
                $scope.childrenMax = $scope.remainingTickets - amountAdults; // Số vé trẻ em tối đa là số vé còn lại trừ đi số vé người lớn đã chọn

                $scope.adultsMax = Math.max($scope.adultsMax, 0);
                $scope.childrenMax = Math.max($scope.childrenMax, 0);

                $scope.totalPrice = (amountAdults * unitPrice) + (amountChildren * (unitPrice * 0.3));
                $scope.totalTikets = (parseInt($scope.ticket.adults) + parseInt($scope.ticket.children)) || 0;
                $scope.isExceedGuestLimit();
            };


            /**
             * phương thức kiểm tra vé
             * @returns {boolean}
             */
            $scope.isExceedGuestLimit = function () {
                let numberOfGuest = $scope.tourDetail.numberOfGuests;
                let bookSeat = $scope.tourDetail.bookedSeat;
                let totalAmountTicket = parseInt($scope.ticket.adults) + parseInt($scope.ticket.children) + parseInt($scope.ticket.baby);

                return totalAmountTicket + bookSeat + 1 > numberOfGuest;
            }

            /**
             * phương thức chuyển tab thì resize lại bản đồ
             */
            $scope.changeTab = function (tabName) {
                $scope.$broadcast('tabChanged', {tabName: tabName});
                $scope.initDataChangeTab(tourDetailId);
            };

            /**
             * phương thức khởi tạo bản đồ
             */
            $scope.initMapTrips = function () {
                $scope.mapTrips = new mapboxgl.Map({
                    container: 'map-trips',
                    style: 'mapbox://styles/mapbox/streets-v12',
                    center: [106.6297, 10.8231],
                    zoom: 9
                });
            }

            /**
             * phương lấy tất cả tour trip ra theo ngày 1
             */
            $scope.initDataChangeTab = function (tourDetailId) {
                TourTripsServiceAD.getTripsByTourId(tourDetailId).then(function (response) {
                    if (response.status === 200) {
                        $scope.tourTrips = response.data.data.tourTrips;
                        $scope.dayInTrip = response.data.data.dayInTrip.map(function (item) {
                            return {
                                dayTrip: item
                            };
                        });

                        $scope.initMapTrips();
                        $scope.createMarkerTrips($scope.tourTrips);
                    } else {
                        $location.path('/admin/page-not-found')
                    }
                }, errorCallback).finally(function () {
                    $scope.isLoading = false;
                });
            }

            /**
             * phương thức thay đổi ngày và điểm đi trên bản đồ
             * @param dayInTrip
             */
            $scope.changeLocationOnMap = function (dayInTrip) {
                $scope.selectedDayTrip = dayInTrip;

                TourTripsServiceAD.findTripsByDayInTrip(dayInTrip, tourDetailId).then(function (response) {
                    if (response.status === 200) {
                        $scope.tourTrips = response.data.data;

                        $scope.initMapTrips();
                        $scope.createMarkerTrips($scope.tourTrips);
                    } else {
                        $location.path('/admin/page-not-found')
                    }
                }, errorCallback).finally(function () {
                    $scope.isLoading = false;
                });
            }

            /**
             * phương thức zoom vị trí trên bản đồ
             * @param placeAddress
             */
            $scope.zoomLocation = function (placeAddress) {
                let bounds = new mapboxgl.LngLatBounds();

                let element = document.getElementById('map-trips');
                if (element) {
                    element.scrollIntoView({behavior: 'smooth', block: 'center'});
                }

                MapBoxService.geocodeAddress(placeAddress, function (error, placeAddressCoordinates) {
                    if (!error) {
                        bounds.extend(placeAddressCoordinates);
                        $scope.mapTrips.fitBounds(bounds, {padding: 20});
                    }
                });
            }

            /**
             * Phương thức thêm marker tour trip trên bản đồ
             */
            $scope.createMarkerTrips = function (tourTrips) {
                let bounds = new mapboxgl.LngLatBounds();

                let count = 1;

                for (const trip of tourTrips) {
                    let placeAddress = trip.placeAddress;
                    let placeImage = trip.placeImage;

                    let elMarkerNot = document.createElement('a');
                    elMarkerNot.className = 'markerNot';
                    elMarkerNot.href = `SCROLL_${trip.id}`
                    elMarkerNot.style.backgroundImage = `url(${placeImage})`;
                    elMarkerNot.style.width = '50px';
                    elMarkerNot.style.height = '50px';
                    elMarkerNot.style.borderRadius = '50%';
                    elMarkerNot.style.backgroundSize = '100%';
                    elMarkerNot.style.border = '3px solid #ff9800';

                    elMarkerNot.addEventListener('click', function (event) {
                        event.preventDefault();

                        let tripId = this.getAttribute('href');
                        let element = document.getElementById(tripId);
                        if (element) {
                            element.scrollIntoView({behavior: 'smooth', block: 'center'});
                        }
                    });

                    let elMarkerTrip = document.createElement('div');
                    elMarkerTrip.className = 'markerTrip';
                    elMarkerTrip.style.position = 'relative';
                    elMarkerTrip.style.width = '20px';
                    elMarkerTrip.style.height = '20px';
                    elMarkerTrip.style.top = '-10px';
                    elMarkerTrip.style.right = '-30px';
                    elMarkerTrip.style.borderRadius = '50%';
                    elMarkerTrip.style.background = '#ff9800';
                    elMarkerTrip.style.textAlign = 'center';
                    elMarkerTrip.style.color = 'white';
                    elMarkerTrip.innerText = `${count}`;
                    elMarkerNot.appendChild(elMarkerTrip);

                    count++;

                    MapBoxService.geocodeAddress(placeAddress, function (error, placeAddressCoordinates) {
                        if (!error) {
                            let marker = new mapboxgl.Marker(elMarkerNot)
                                .setLngLat(placeAddressCoordinates)
                                .addTo($scope.mapTrips);

                            $scope.markerTrips.push(marker);
                            $scope.coordinateTrips.push(placeAddressCoordinates);

                            bounds.extend(placeAddressCoordinates);
                            $scope.mapTrips.fitBounds(bounds, {padding: 20});
                        }
                    });
                }

                // $scope.mapTrips.on('style.load', async function () {
                //     let waypoints = ''; // Chuỗi để lưu trữ các tọa độ trung gian
                //
                //     $scope.coordinateTrips.forEach(function (coordinate, index) {
                //         waypoints += `${coordinate[0]},${coordinate[1]}`;
                //         if (index < $scope.coordinateTrips.length - 1) {
                //             waypoints += ';'; // Thêm dấu chấm phẩy giữa các tọa độ, trừ tọa độ cuối cùng
                //         }
                //     });
                //
                //     let routeURL = `https://api.mapbox.com/directions/v5/mapbox/driving/${waypoints}?geometries=geojson&steps=true&access_token=${mapboxgl.accessToken}`;
                //
                //     await fetch(routeURL)
                //         .then(response => response.json())
                //         .then(data => {
                //             // Lấy dữ liệu về đường đi
                //             let route = data.routes[0].geometry;
                //
                //             $scope.mapLineLayerId = 'map-line-' + new Date().getTime();
                //
                //             $scope.mapTrips.addLayer({
                //                 'id': $scope.mapLineLayerId,
                //                 'type': 'line',
                //                 'source': {
                //                     'type': 'geojson',
                //                     'data': {
                //                         'type': 'Feature',
                //                         'properties': {},
                //                         'geometry': route
                //                     }
                //                 },
                //                 'layout': {
                //                     'line-join': 'round',
                //                     'line-cap': 'round'
                //                 },
                //                 'paint': {
                //                     'line-color': '#e35050',
                //                     'line-width': 3
                //                 }
                //             });
                //         })
                //         .catch(error => {
                //             console.error('Lỗi khi lấy thông tin định tuyến:', error);
                //         });
                // });
            }

            /**
             * Phương thức xóa toàn bộ đường dẫn vẽ trên bản đồ
             */
            $scope.removeMapLayer = function (mapLineLayerId) {
                if (mapLineLayerId && $scope.mapTrips.getLayer(mapLineLayerId)) {
                    $scope.mapTrips.removeLayer(mapLineLayerId);
                    $scope.mapTrips.removeSource(mapLineLayerId);
                } else {
                    console.log("không xóa dược")
                }
            }

            /**
             * Phương thức xóa marker tour trip trên bản đồ
             */
            $scope.removeMarkerTrips = function () {
                if ($scope.markerTrips.length > 0) {
                    $scope.markerTrips.forEach(function (marker) {
                        marker.remove();
                    });
                    $scope.markerTrips = [];
                }
            };

            /**
             * phương thức gửi booking cho server
             */
            $scope.submitBooking = function () {
                let numberOfGuest = $scope.tourDetail.numberOfGuests;
                let bookSeat = $scope.tourDetail.bookedSeat;
                let totalAmountTicket = parseInt($scope.ticket.adults) + parseInt($scope.ticket.children) + parseInt($scope.ticket.baby);
                let newAmountTicket = totalAmountTicket + bookSeat;

                if (newAmountTicket > numberOfGuest) {
                    centerAlert('Cảnh báo !', 'Số lượng bạn chọn không phù hợp với tour hiện tại ! Vui lòng chọn lại, số lượng còn lại là ' + (numberOfGuest - bookSeat) + ' vé.', 'warning');
                } else {
                    let dataBooking = {
                        ticket: $scope.ticket,
                        totalPrice: $scope.totalPrice,
                        tourDetail: $scope.tourDetail,
                        provinceName: $scope.provinceName
                    }

                    LocalStorageService.encryptLocalData(dataBooking, 'dataBooking', 'encryptDataBooking');
                    $location.path('/tours/tour-detail/' + Base64ObjectService.encodeObject(tourDetailId) + '/booking-tour');
                }
            }
        }

        /**
         * phương thức khởi tạo bản đồ vẽ lịch trình
         */
        $scope.initMapSchedules = function () {
            $scope.isLoading = true;

            $scope.provinceName = [];

            if (!tourDetailId) return;

            TourDetailsServiceAD.findTourDestinationByTourDetailById(tourDetailId).then(function (response) {
                if (response.status === 200) {
                    $scope.arrayDataProvince = response.data.data;

                    if ($scope.arrayDataProvince !== null) {
                        $scope.arrayDataProvince.forEach(function (item) {
                            $scope.provinceName.push(item.province);
                        });
                    } else {
                        $scope.provinceName = [];
                    }

                    let fromLocation = $scope.tourDetail.fromLocation;
                    let toLocation = $scope.tourDetail.toLocation;
                    let intermediatePoints = $scope.provinceName;

                    // Lấy tọa độ từ tên địa chỉ cho cả điểm đi và điểm đến
                    MapBoxService.geocodeAddress(fromLocation, function (error, fromCoordinates) {
                        if (!error) {
                            MapBoxService.geocodeAddress(toLocation, function (error, toCoordinates) {
                                if (!error) {
                                    if (intermediatePoints.length > 0) {
                                        let coordinatesList = intermediatePoints.map(function (point) {
                                            return new Promise(function (resolve, reject) {
                                                MapBoxService.geocodeAddress(point, function (error, coordinates) {
                                                    if (!error) {
                                                        resolve(coordinates);
                                                    } else {
                                                        reject(error);
                                                    }
                                                });
                                            });
                                        });

                                        Promise.all(coordinatesList)
                                            .then(function (intermediateCoordinates) {
                                                let waypoints = intermediateCoordinates.map(coord => `${coord[0]},${coord[1]}`).join(";");
                                                let routeURL = `https://api.mapbox.com/directions/v5/mapbox/driving/${fromCoordinates[0]},${fromCoordinates[1]};${waypoints};${toCoordinates[0]},${toCoordinates[1]}?geometries=geojson&steps=true&access_token=${mapboxgl.accessToken}`;

                                                drawMap(routeURL, fromCoordinates, toCoordinates, intermediateCoordinates);
                                            })
                                            .catch(error => {
                                                console.error('Lỗi khi lấy tọa độ của các điểm trung gian:', error);
                                            });
                                    } else {
                                        let routeURL = `https://api.mapbox.com/directions/v5/mapbox/driving/${fromCoordinates[0]},${fromCoordinates[1]};${toCoordinates[0]},${toCoordinates[1]}?geometries=geojson&steps=true&access_token=${mapboxgl.accessToken}`;

                                        drawMap(routeURL, fromCoordinates, toCoordinates, []);
                                    }
                                } else {
                                    console.error("Lỗi khi lấy tọa độ của điểm đi hoặc điểm đến:", error);
                                }
                            });
                        } else {
                            console.error("Lỗi khi lấy tọa độ của điểm đi:", error);
                        }
                    });
                } else {
                    $location.path('/admin/page-not-found')
                }
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        /**
         * phương thức vẽ lịch trình trên map
         * @param routeURL
         * @param fromCoordinates
         * @param toCoordinates
         * @param intermediateCoordinates
         */
        function drawMap(routeURL, fromCoordinates, toCoordinates, intermediateCoordinates) {
            const map = $scope.map = new mapboxgl.Map({
                container: 'map-schedules',
                style: 'mapbox://styles/mapbox/streets-v12',
                center: toCoordinates,
                zoom: 10
            });

            map.on('load', () => {
                $scope.createMarkerSchedules(fromCoordinates, map, 'start');
                $scope.createMarkerSchedules(toCoordinates, map, 'end');

                if (intermediateCoordinates.length > 0) {
                    intermediateCoordinates.forEach(coord => {
                        $scope.createMarkerSchedules(coord, map, 'waypoint');
                    });
                }

                fetch(routeURL)
                    .then(response => response.json())
                    .then(data => {
                        // Lấy dữ liệu về đường đi
                        let route = data.routes[0].geometry;

                        // Vẽ đường đi trên bản đồ
                        map.addLayer({
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
            });
        }

        /**
         * phương thức tạo marker trên bản đồ
         * @param coordinates
         * @param map
         * @param type
         */
        $scope.createMarkerSchedules = function (coordinates, map, type) {
            let popupContent;
            let tourDetail = $scope.tourDetail;

            if (type === 'start') {
                popupContent = 'Điểm bắt đầu';
            } else if (type === 'end') {
                popupContent = createPopupContent(tourDetail);
            } else if (type === 'waypoint') {
                popupContent = 'Điểm dừng chân, tham quan';
            } else {
                popupContent = 'Công ty dịch vụ lữ hành TravelTour';
            }

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
            }).setHTML(popupContent);

            new mapboxgl.Marker(el)
                .setLngLat(coordinates)
                .setPopup(popup)
                .addTo(map);

            let closeButton = popup._content.querySelector('.mapboxgl-popup-close-button');
            if (closeButton) {
                closeButton.style.fontSize = '20px';
                closeButton.style.width = '20px';
                closeButton.style.height = '20px';
                closeButton.style.lineHeight = '20px';
            }
        }

        $scope.init();

        function createPopupContent(tourDetail) {
            let formattedDate = $filter('formatDate')(tourDetail.departureDate);
            return `    <div class="m-1 mb-30 row">
                        <div class="img-holder col-xl-3 col-lg-4 p-0">
                            <img src="${tourDetail.toursByTourId.tourImg}" class="rounded-3" style="height: 130px"
                                 onerror="this.src='/assets/admin/assets/img/bg/default-image-hotel.png'"/>
                        </div>
                        <div class=" col-xl-9 col-lg-8">
                            <div class="meta row">
                                <div class="col-lg-8">
                                    <div>
                                        <span>
                                            <i class="fa-solid fa-street-view"></i>
                                            <a class="fw-medium">
                                                ${tourDetail.tourTypes.tourTypeName}
                                            </a>
                                        </span>
                                        <h3 class="fw-medium">
                                            <a href="#">${tourDetail.toursByTourId.tourName}</a>
                                        </h3>
                                        <div class="d-flex align-items-center mb-3"
                                             style="border-bottom: 1px solid rgba(29, 35, 31, 0.1);">
                                            <div class="location text-orange" style="font-size: 14px">
                                                <p>
                                                    <span class="fas fa-map-marker-alt"></span>
                                                    ${tourDetail.fromLocation}
                                                    -
                                                    ${tourDetail.toLocation}
                                                </p>
                                                <p>
                                                    <i class="fa-solid fa-user-tie"></i>
                                                    Đã đặt: ${tourDetail.bookedSeat}/${tourDetail.numberOfGuests} chổ
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="roomTypeByHotel mb-3"
                                         style="padding-left: 10px ;border-left: 1px solid rgba(29, 35, 31, 0.1)">
                                        <div style="font-size: 14px; line-height: 20px">
                                            <p class="fs-7 mb-1">Điểm đi:
                                                <span class="fw-medium">${tourDetail.fromLocation}</span>
                                            </p>
                                            <p class="fs-7 mb-1">Điểm đến:
                                                <span class="fw-medium">${tourDetail.toLocation}</span>
                                            </p>
                                            <p class="fs-7 mb-1">Ngày đi:
                                                <span class="fw-medium">${formattedDate}</span>
                                            </p>
                                            <div class="text-green">
                                                <i class="fa-solid fa-check"></i> Xe có WIFI miễn phí
                                            </div>
                                            <div class="text-green">
                                                <i class="fa-solid fa-check"></i> Miễn phí nước suối
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-4">
                                    <div class="infoHotel h-100 w-100 position-relative row">
                                        <div class="rating col-xl-12 col-lg-12 col-sm-6 col-6">
                                            <div class="float-end" style="font-size: 14px; line-height: 20px">
                                                <div class="d-flex align-items-center">
                                                    <div class="rating-content float-end m-2">
                                                        <p>Rất tốt</p>
                                                        <p>133 Đánh giá</p>
                                                    </div>
                                                    <div class="rating-content float-end">
                                                        <div class="btn-green text-center"
                                                             style="width: 50px; height: 50px; line-height: 50px; border-radius: 8px">
                                                            <span class="fw-medium fs-5">4.9</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="price position-absolute bottom-0 end-0 mb-3 me-3 col-xl-12 col-lg-12 col-sm-6 col-6">
                                            <div class="box">
                                                <div class="fw-bold text-end" style="font-size: 20px">
                                                    ${$scope.formatPrice(tourDetail.unitPrice)} ₫
                                                </div>
                                                <a href="#" id="redirectTourDetail" class="btn btn-green w-100 mt-3">Điểm đến</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
        }

        $scope.showCallTourModal = function () {
            ToursServiceAD.findAllToursSelect().then(function (response) {
                $scope.tourBasicList = response.data.data;
            }, errorCallback);
            $('#formTourModal').modal('show');
        };
        $scope.closeFormModal = function () {
            $('#formTourModal').modal('hide');
        };


        $scope.likeTour = function (serviceId) {
            $scope.category = 0
            if (user != null && user) {
                UserLikeService.saveLike(serviceId, $scope.category, user.id).then(function (response) {
                    if (response.status === 200) {
                        toastAlert('success', response.data.message)
                        $scope.playSuccessSound()
                        $scope.checkIsLikeTour(serviceId)
                    } else {
                        toastAlert('error', response.data.message)
                    }
                })
            } else {
                centerAlert('Thất bại !', "Vui lòng đăng nhập để yêu thích tour này !", 'warning');
            }
        }
        $scope.isLikeTour = false;
        $scope.checkIsLikeTour = async function (serviceId) {
            try {
                const response = await UserLikeService.findUserLikeByCategoryIdAndServiceId(serviceId, user.id);
                if (response.status === 200 && response.data.status === "200") {
                    $scope.isLikeTour = response.data.data;
                    $scope.$apply();
                }
            } catch (error) {
            }
        };

        $scope.findUserComments = function (transId) {
            if ($scope.size === null || $scope.page === null) {
                $scope.size = 10;
                $scope.page = 0;
                UserCommentsService.findCommentsByServiceId(transId, 'DESC', $scope.size, $scope.page).then(function (response) {
                    $scope.ratingHotel = response.data;

                    if ($scope.ratingHotel.roundedAverageRating % 1 !== 0) {
                        $scope.showHalfStar = true;
                        $scope.stars = new Array(Math.floor($scope.ratingHotel.roundedAverageRating));
                    } else {
                        $scope.showHalfStar = false;
                        $scope.stars = new Array($scope.ratingHotel.roundedAverageRating);
                    }
                })
            } else {
                $scope.size = $scope.size + 5;
                $scope.page = $scope.page + 1;
                UserCommentsService.findCommentsByServiceId(transId, 'DESC', $scope.size, $scope.page).then(function (response) {
                    $scope.ratingHotel = response.data;

                    if ($scope.ratingHotel.roundedAverageRating % 1 !== 0) {
                        $scope.showHalfStar = true;
                        $scope.stars = new Array(Math.floor($scope.ratingHotel.roundedAverageRating));
                    } else {
                        $scope.showHalfStar = false;
                        $scope.stars = new Array($scope.ratingHotel.roundedAverageRating);
                    }
                })
            }
        }

        $timeout(function () {
            var swiper = new Swiper('.swiper-container', {
                // Các tùy chọn Swiper
                slidesPerView: 1,
                loop: true, autoplay: {
                    delay: 2500,
                    disableOnInteraction: false,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
            });
        }, 500);

        $scope.redirectToChatTour = function () {
            var encodedId = btoa('66');

            if (user == null) {
                LocalStorageService.set("redirectAfterLogin", "/hotel/hotel-details");
                $location.path('/sign-in');
            } else {
                $location.path('/chat/' + encodedId);
            }

        }
    });