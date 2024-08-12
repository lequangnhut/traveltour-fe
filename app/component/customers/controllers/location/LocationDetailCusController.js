travel_app.controller('LocationDetailCusController',
    function ($scope, $location, $timeout, LocationDetailCusService, UserLikeService, Base64ObjectService,
              AuthService, UserCommentsService, LocationCusService, $sce, $routeParams,
              LocalStorageService, TourTripsServiceAD, TourDetailsServiceAD, MapBoxService) {
        mapboxgl.accessToken = 'pk.eyJ1IjoicW5odXQxNyIsImEiOiJjbHN5aXk2czMwY2RxMmtwMjMxcGE1NXg4In0.iUd6-sHYnKnhsvvFuuB_bA';
        let user = null
        user = AuthService.getUser();
        $scope.tickets = {
            departureDate: new Date(),
            adultTickets: 1,
            childrenTickets: 0,
            freeTickets: 0,
            adultPrice: 0,
            childrenPrice: 0,
            totalTickets: 1,
            totalPrice: 0,
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
            if ($scope.tickets.departureDate === undefined) {
                $scope.tickets.departureDate = currentDate;
                toastAlert('warning', 'Không được nhập ngày quá khứ!');
            }
        };

        $scope.calculateTotalPrice = () => {
            $scope.tickets.totalPrice = ($scope.tickets.adultTickets * $scope.tickets.adultPrice) + ($scope.tickets.childrenTickets * $scope.tickets.childrenPrice);
            $scope.tickets.totalTickets = $scope.tickets.adultTickets + $scope.tickets.childrenTickets;
        };

        $scope.onQuantityBlurAdult = (rt) => {
            if (rt.adultTickets === null || rt.adultTickets === '' || rt.adultTickets < 1) {
                rt.adultTickets = 1;
            }
            $scope.calculateTotalPrice();
        };

        $scope.onQuantityBlurChildren = (rt) => {
            if (rt.childrenTickets === null || rt.childrenTickets === '' || rt.childrenTickets < 1) {
                rt.childrenTickets = 0;
            }
            $scope.calculateTotalPrice();
        };
        const visitLocationId = Base64ObjectService.decodeObject($routeParams.id);

        const errorCallback = () => {
            $location.path('/admin/internal-server-error')
        }

        $scope.init = () => {
            $scope.isLoading = true;

            LocationDetailCusService.findById(visitLocationId).then((response) => {
                if (response.status === 200) {
                    $scope.locationDetail = response.data.data;
                    $scope.checkIsLikeLocation($scope.locationDetail.id)
                    // Giả định rằng visitLocationTicketsById là mảng và không rỗng
                    const tickets = $scope.locationDetail.visitLocationTicketsById || [];
                    let adultPrice = 0, childrenPrice = 0;

                    // Lọc và phân loại vé một lần
                    tickets.forEach(ticket => {
                        const ticketName = ticket.ticketTypeName.toLowerCase();
                        if (ticketName === 'vé người lớn') {
                            adultPrice = ticket.unitPrice;
                        } else if (ticketName === 'vé trẻ em') {
                            childrenPrice = ticket.unitPrice;
                        }
                    });

                    $scope.tickets.adultPrice = adultPrice;
                    $scope.tickets.childrenPrice = childrenPrice;

                    // Tính toán tổng giá vé
                    $scope.calculateTotalPrice();

                    $scope.locationDetailDescription = $sce.trustAsHtml($scope.locationDetail.detailDescription);

                    // Tìm giá vé thấp nhất để hiển thị
                    if (tickets.length > 0) {
                        $scope.priceTickets = Math.min(...tickets.map(item => item.unitPrice));
                    }

                    const {address, ward, district, province} = $scope.locationDetail;
                    const fullAddress = [address, ward, district, province].filter(Boolean).join(', ');

                    // Tải bản đồ dựa trên địa chỉ đầy đủ
                    $scope.loadMap(fullAddress);
                    console.log($scope.locationDetail)
                    $scope.findUserComments($scope.locationDetail.id)
                } else {
                    $location.path('/admin/page-not-found')
                }
            }, errorCallback).finally(() => {
                $scope.isLoading = false;
            });


            LocationDetailCusService.findAllTrend().then((response) => {
                if (response.status === 200) {
                    $scope.locationTrendData = response.data.data;

                    let allUnitPrices = $scope.locationTrendData.reduce((acc, location) => {
                        if (location.visitLocationTicketsById && location.visitLocationTicketsById.length > 0) {
                            let prices = location.visitLocationTicketsById.map(ticket => ticket.unitPrice);
                            return acc.concat(prices);
                        }
                        return acc;
                    }, []);

                    if (allUnitPrices.length > 0) {
                        $scope.priceTicketsTrend = Math.min(...allUnitPrices);
                    } else {
                        console.log("No ticket data available.");
                    }
                } else {
                    $location.path('/admin/page-not-found')
                }
            }, errorCallback).finally(() => {
                $scope.isLoading = false;
            });
        }

        /**
         * phương thức gửi booking location cho server
         */
        $scope.submitBookingLocation = () => {
            LocalStorageService.encryptLocalData($scope.tickets, 'dataBookingLocation', 'encryptDataBookingLocation');
            $location.path('/tourism-location/tourism-location-detail/' + btoa(JSON.stringify(visitLocationId)) + '/booking-location');
        }

        $scope.loadMap = (address) => {
            MapBoxService.getCoordinatesFromAddress(address).then((coordinates) => {
                const map = new mapboxgl.Map({
                    container: 'map', style: 'mapbox://styles/mapbox/streets-v11', center: coordinates, zoom: 15
                });

                // Gọi hàm createMarker để thêm marker vào bản đồ
                $scope.createMarker(coordinates, map, 'custom-type'); // 'custom-type' có thể được thay thế bằng loại địa điểm thực tế
            }).catch((error) => {
                console.error('Error getting location:', error);
            });
        };


        // Hàm này tạo nội dung cho popup dựa trên chi tiết địa điểm
        const createPopupContent = (locationDetail) => {
            // Sử dụng thông tin từ locationDetail để điền vào các trường
            return `
        <div class="popup-content row">
            <div class="img-holder col-4">
                <img src="${locationDetail.visitLocationImage || '/assets/admin/assets/img/bg/default-image-hotel.png'}" alt="${locationDetail.visitLocationName}" style="height: 170px; width: 100%; object-fit: cover;">
            </div>
            <div class="col-8">
                <div class="meta">
                    <div class="col-12">
                        <span><i class="fa-solid fa-street-view"></i> ${locationDetail.visitLocationName}</span>
                        <h3 class="text-capitalize">${locationDetail.visitLocationName}</h3>
                        <div class="d-flex align-items-center mb-3" style="border-bottom: 1px solid rgba(29, 35, 31, 0.1);">
                            <div class="location text-orange" style="font-size: 14px;">
                                <p><span class="fas fa-map-marker-alt"></span> ${locationDetail.address}, ${locationDetail.ward}, ${locationDetail.district}, ${locationDetail.province}</p>
                                <p><i class="fa-solid fa-phone"></i> Điện thoại: ${locationDetail.phone}</p>
                            </div>
                        </div>
                        <div class="" style="padding-left: 10px; border-left: 1px solid rgba(29, 35, 31, 0.1);">
                            <div style="font-size: 14px; line-height: 20px;">
                                <p class="text-green mb-0"><i class="fa-solid fa-check"></i> Website: <a href="${locationDetail.urlWebsite}" target="_blank">${locationDetail.urlWebsite}</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
        }

        // Hàm này tạo và thêm marker vào bản đồ
        $scope.createMarker = (coordinates, map, type) => {

            // Lựa chọn nội dung popup dựa trên loại địa điểm
            let popupContent = createPopupContent($scope.locationDetail); // Sử dụng hàm đã chỉnh sửa

            // Tạo div cho marker
            let el = document.createElement('div');
            el.className = 'marker';
            el.style.backgroundImage = `url('/assets/customers/images/icon/maker.png')`;
            el.style.width = '40px';
            el.style.height = '40px';
            el.style.backgroundSize = '100%';

            // Tạo popup và gán nội dung
            let popup = new mapboxgl.Popup({
                offset: 15,
                closeButton: true,
                closeOnClick: false,
                closeOnClickOutside: true,
                maxWidth: '500px',
                minWidth: '600px'
            }).setHTML(popupContent);

            // Thêm marker vào bản đồ và gán popup cho nó
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

        $scope.scrollToMap = () => {
            let mapElement = document.getElementById('map');
            if (mapElement) {
                mapElement.scrollIntoView({behavior: 'smooth', block: 'center'});
            }
        };

        $scope.likeLocation = function (serviceId) {
            $scope.category = 3
            if (user != null && user) {
                UserLikeService.saveLike(serviceId, $scope.category, user.id).then(function (response) {
                    if (response.status === 200) {
                        toastAlert('success', response.data.message)
                        $scope.playSuccessSound()
                        $scope.checkIsLikeLocation(serviceId)
                    } else {
                        toastAlert('error', response.data.message)
                    }
                })
            } else {
                centerAlert('Thất bại !', "Vui lòng đăng nhập để yêu thích điểm tham quan này !", 'warning');
            }
        }
        $scope.isLikeLocation = false;
        $scope.checkIsLikeLocation = async function (serviceId) {
            try {
                const response = await UserLikeService.findUserLikeByCategoryIdAndServiceId(serviceId, user.id);
                if (response.status === 200 && response.data.status === "200") {
                    $scope.isLikeLocation = response.data.data;
                    $scope.$apply();
                }
            } catch (error) {
            }
        };


        $scope.init();

        $scope.findUserComments = function (transId) {
            if ($scope.size === null || $scope.page === null) {
                $scope.size = 10;
                $scope.page = 0;
                UserCommentsService.findCommentsByServiceId(transId, 'DESC', $scope.size, $scope.page).then(function (response) {
                    console.log(response)
                    $scope.ratingHotel = response.data;

                    if ($scope.ratingHotel.roundedAverageRating % 1 !== 0) {
                        $scope.showHalfStar = true;
                        $scope.stars = new Array(Math.floor($scope.ratingHotel.roundedAverageRating));
                    } else {
                        $scope.showHalfStar = false;
                        $scope.stars = new Array($scope.ratingHotel.roundedAverageRating);
                    }
                    console.log($scope.ratingStar)
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
    });