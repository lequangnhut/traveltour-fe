travel_app.controller('HotelCustomerController', function ($scope, $location, $window, $anchorScroll, HotelServiceCT, RoomTypeService) {
    mapboxgl.accessToken = 'pk.eyJ1IjoicW5odXQxNyIsImEiOiJjbHN5aXk2czMwY2RxMmtwMjMxcGE1NXg4In0.iUd6-sHYnKnhsvvFuuB_bA';

    $anchorScroll();

    $scope.showMoreHotelType = false;
    $scope.limitHotelType = 5;

    $scope.showMorePlaceUtilities = false;
    $scope.limitPlaceUtilities = 5;

    $scope.showMoreBedType = false;
    $scope.limitBedType = 5;

    $scope.showRoomUtilities = false;
    $scope.limitRoomUtilities = 5;

    $scope.today = new Date();

    $scope.hotelTypeMap = {};

    $scope.markers= [];
    $scope.markersById = [];

    $scope.filler = {
        priceFilter: 30000000,
        hotelTypeIdListFilter: [],
        placeUtilitiesIdListFilter: [],
        roomUtilitiesIdListFilter: [],
        breakfastIncludedFilter: null,
        freeCancellationFilter: null,
        roomBedsIdListFilter: [],
        amountRoomFilter: null,
        locationFilter: null,
        capacityAdultsFilter: null,
        capacityChildrenFilter: null,
        checkInDateFiller: new Date(),
        checkOutDateFiller: new Date(),
        page: 0,
        size: 10,
        sort: null
    }

    $scope.totalPages = 0;

    $scope.filler.checkOutDateFiller.setDate($scope.filler.checkOutDateFiller.getDate() + 1);
    $scope.daysBetween = Math.floor(($scope.filler.checkOutDateFiller - $scope.filler.checkInDateFiller) / (1000 * 60 * 60 * 24));
    $scope.ratings = [{id: 1, label: 'Trên 1 sao'}, {id: 2, label: 'Trên 2 sao'}, {id: 3, label: 'Trên 3 sao'}, {
        id: 4,
        label: 'Trên 4 sao'
    }, {id: 5, label: 'Trên 5 sao'}];

    $scope.selectedRating = null;

    $scope.roomTypes = {
        id: null,
        roomTypeName: null,
        hotelId: null,
        capacityAdults: null,
        capacityChildren: null,
        bedTypeId: null,
        amountRoom: null,
        price: null,
        isActive: null,
        isDeleted: null,
        breakfastIncluded: false,
        freeCancellation: false,
        checkinTime: null,
        checkoutTime: null,
        roomTypeAvatar: null,
        roomTypeDescription: null,
        roomImagesById: [],
        roomUtilities: [],
        roomBedsById: {},
        listRoomTypeImg: [],
        hotelsByHotelId: {
            id: null,
            hotelName: null,
            phoneNumber: null,
            website: null,
            province: null,
            district: null,
            ward: null,
            address: null,
            provinceName: null,
            districtName: null,
            wardName: null,
            floorNumber: null,
            avatarHotel: null,
            hotelType: null,
            agencyId: null,
            longitude: null,
            latitude: null,
            hotelTypesByHotelTypeId: {
                id: null, hotelTypeName: null, hotelsById: null,
            },

        },
    }


    $scope.hotelTypes = {
        id: null, hotelTypeName: null, hotelsById: null,
    }

    $scope.placeUtilities = {
        id: null, placeUtilitiesName: null,
    }

    $scope.bedTypes = {
        id: null, bedTypeName: null,
    }

    $scope.checkboxModel = {
        freeBreakfast: false, freeCancellation: false
    };

    $scope.roomUtilities = {
        id: null, roomUtilitiesName: null,
    }

    /**
     * Phương thức tính số ngày giữa 2 ngày
     * @returns {number} số ngày giữa 2 ngày
     */
    $scope.calculateDaysBetween = function () {
        return Math.floor(($scope.filler.checkInDateFiller, $scope.filler.checkOutDateFiller) / (1000 * 60 * 60 * 24));
    };

    /**
     * Phương thức sắp xếp các trường dữ liệu
     * @param column
     */
    $scope.sortData = function (column) {
        $scope.sortBy = column;
        $scope.sortDir = ($scope.sortDir === 'asc') ? 'desc' : 'asc';
        $scope.getRoomTypeList();
    };

    /**
     * Phương thức khởi tạo bản đồ của danh sách phòng
     */
    $scope.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [105.804817, 21.028511],
        zoom: 9
    });

    /**
     * Phương thức khởi tạo bản đồ dựa vào mã phòng
     */
    $scope.mapById = new mapboxgl.Map({
        container: 'mapById',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [105.804817, 21.028511],
        zoom: 9
    });

    /**
     * Phương thức thêm marker lên bản đồ
     * @param roomTypes
     */
    $scope.addMarkers = function (roomTypes) {
        $scope.removeMarkers()
        var bounds = new mapboxgl.LngLatBounds();
        var maxOffset = 0.001; // Độ lệch tối đa

        for (const roomType of roomTypes) {
            const iconUrl = '/assets/customers/images/hotel/placeholder.png';
            const el = document.createElement('div');
            el.className = 'marker';
            el.style.backgroundImage = `url(${iconUrl})`;
            el.style.width = '30px';
            el.style.height = '30px';
            el.style.backgroundSize = '100%';

            var popupContent = createPopupContent(roomType);

            if (!isNaN(roomType.hotelsByHotelId.longitude) && !isNaN(roomType.hotelsByHotelId.latitude)) {
                var lng = parseFloat(roomType.hotelsByHotelId.longitude);
                var lat = parseFloat(roomType.hotelsByHotelId.latitude);

                var randomOffset = Math.random() * maxOffset * (Math.random() < 0.5 ? -1 : 1);

                lng += randomOffset;
                lat += randomOffset;

                var lngLat = new mapboxgl.LngLat(lng, lat);

                var popup = new mapboxgl.Popup({
                    offset: 15,
                    closeButton: true,
                    closeOnClick: false,
                    closeOnClickOutside: true,
                    maxWidth: '800px',
                    minWidth: '600px'
                }).setHTML(popupContent);

                var marker = new mapboxgl.Marker(el)
                    .setLngLat(lngLat)
                    .setPopup(popup)
                    .addTo($scope.map);

                bounds.extend(lngLat);

                var closeButton = popup._content.querySelector('.mapboxgl-popup-close-button');
                if (closeButton) {
                    closeButton.style.fontSize = '30px';
                    closeButton.style.width = '40px';
                    closeButton.style.height = '40px';
                    closeButton.style.lineHeight = '40px';
                }
            } else {
                console.error('Invalid latitude or longitude value:', roomType.hotelsByHotelId.longitude, roomType.hotelsByHotelId.latitude);
            }

            $scope.markers.push(marker);
        }
        $scope.map.fitBounds(bounds, {padding: 20});

    };

    /**
     * Phương thức xóa marker trên bản đồ dựa vào id phòng khách sạn
     * @param roomType Thông tin phòng khách sạn
     */
    $scope.addMarkersById = function(roomType) {
        $scope.removeMarkersById();
        var bounds = new mapboxgl.LngLatBounds(); // Khởi tạo bounds

        const iconUrl = '/assets/customers/images/hotel/placeholder.png';
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = `url(${iconUrl})`;
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.backgroundSize = '100%';

        var popupContent = createPopupContent(roomType);

        var popup = new mapboxgl.Popup({
            offset: 15,
            closeButton: true,
            closeOnClick: false,
            closeOnClickOutside: true,
            maxWidth: '800px',
            minWidth: '600px'
        }).setHTML(popupContent);

        var marker = new mapboxgl.Marker(el)
            .setLngLat([roomType.hotelsByHotelId.longitude, roomType.hotelsByHotelId.latitude])
            .setPopup(popup)
            .addTo($scope.mapById);

        var closeButton = popup._content.querySelector('.mapboxgl-popup-close-button');
        if (closeButton) {
            closeButton.style.fontSize = '30px';
            closeButton.style.width = '40px';
            closeButton.style.height = '40px';
            closeButton.style.lineHeight = '40px';
        }

        $scope.markersById.push(marker);

        bounds.extend([roomType.hotelsByHotelId.longitude, roomType.hotelsByHotelId.latitude]);
        $scope.mapById.fitBounds(bounds, { padding: 20 });
    };


    /**
     * Phương thức xóa marker trên bản đồ
     */
    $scope.removeMarkers = function() {
        if ($scope.markers.length > 0) {
            $scope.markers.forEach(function(marker) {
                marker.remove();
            });
            $scope.markers = [];
        }
    };

    /**
     * Phương thức xóa marker trên bản đồ dựa vào id phòng khách sạn
     */
    $scope.removeMarkersById = function() {
        if ($scope.markersById.length > 0) {
            $scope.markersById.forEach(function(marker) {
                marker.remove();
            });
            $scope.markersById = [];
        }
    };

    /**
     * Phương thức format giá tiền
     * @param price
     * @returns {string}
     */
    $scope.formatPrice = function(price) {
        var formattedPrice = price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        formattedPrice = formattedPrice.replace('₫', '');

        return formattedPrice;
    }

    /**
     * Phương thức kiểm rta giá có đúng định dạng số không
     */
    $scope.checkPriceFormat = function () {
        if (!/^[0-9]*$/.test($scope.tourDetail.unitPrice)) {
            $scope.invalidPriceFormat = true;
        } else {
            $scope.invalidPriceFormat = false;
        }
    };

    /**
     * Hàm xử lý sự kiện khi nhấn nút hiển thị thêm của loại khách sạn
     */
    $scope.showMoreItemsHotelType = function () {
        $scope.limitHotelType = $scope.hotelTypes.length;
        $scope.showMoreHotelType = true;
    };

    /**
     * Hàm xử lý sự kiện khi nhấn nút ẩn bớt của loại khách sạn
     */
    $scope.showLessItemsHotelType = function () {
        $scope.limitHotelType = 5;
        $scope.showMoreHotelType = false;
    };

    /**
     * Hàm xử lý sự kiện khi nhấn nút hiển thị thêm của tiện ích khách sạn
     */
    $scope.showMoreItemsPlaceUtilities = function () {
        $scope.limitPlaceUtilities = $scope.placeUtilities.length;
        $scope.showMorePlaceUtilities = true;
    };

    /**
     * Hàm xử lý sự kiện khi nhấn nút ẩn bớt của tiện ích khách sạn
     */
    $scope.showLessItemsPlaceUtilities = function () {
        $scope.limitPlaceUtilities = 5;
        $scope.showMorePlaceUtilities = false;
    };

    /**
     * Hàm xử lý sự kiện khi nhấn nút hiển thị thêm của loại giường
     */
    $scope.showMoreItemsRoomBed = function () {
        $scope.limitBedType = $scope.bedTypes.length;
        $scope.showMoreBedType = true;
    };

    /**
     * Hàm xử lý sự kiện khi nhấn nút ẩn bớt của loại giường
     */
    $scope.showLessItemsRoomBed = function () {
        $scope.limitBedType = 5;
        $scope.showMoreBedType = false;
    };

    /**
     * Hàm xử lý sự kiện khi nhấn nút hiển thị thêm của loại giường
     */
    $scope.showMoreItemsRoomUtilities = function () {
        $scope.limitRoomUtilities = $scope.roomUtilities.length;
        $scope.showMoreRoomUtilities = true;
    };

    /**
     * Hàm xử lý sự kiện khi nhấn nút ẩn bớt của loại giường
     */
    $scope.showLessItemsRoomUtilities = function () {
        $scope.limitRoomUtilities = 5;
        $scope.showMoreRoomUtilities = false;
    };

    /**
     * Xử lí sự kiện khi chọn loại phòng
     * @param hotelId id của loại phòng
     */
    $scope.toggleSelectionHotelType = function (hotelId) {
        var index = $scope.filler.hotelTypeIdListFilter.indexOf(hotelId);
        if (index === -1) {
            $scope.filler.hotelTypeIdListFilter.push(hotelId);
        } else {
            $scope.filler.hotelTypeIdListFilter.splice(index, 1);
        }
    };

    /**
     * Xử lí sự kiện khi chọn dịch vụ khách sạn
     * @param placeUtilId id của dịch vụ khách sạn
     */
    $scope.toggleSelectionPlaceUtil = function (placeUtilId) {
        var index = $scope.filler.placeUtilitiesIdListFilter.indexOf(placeUtilId);
        if (index === -1) {
            $scope.filler.placeUtilitiesIdListFilter.push(placeUtilId);
        } else {
            $scope.filler.placeUtilitiesIdListFilter.splice(index, 1);
        }
    };

    /**
     * Xử lí sự kiện khi chọn dịch vụ phòng khách sạn
     * @param roomUtilId id của dịch vụ phòng khách sạn
     */
    $scope.toggleSelectionRoomUtil = function (roomUtilId) {
        var index = $scope.filler.roomUtilitiesIdListFilter.indexOf(roomUtilId);
        if (index === -1) {
            $scope.filler.roomUtilitiesIdListFilter.push(roomUtilId);
        } else {
            $scope.filler.roomUtilitiesIdListFilter.splice(index, 1);
        }
    }

    /**
     * Xử lí sự kiện khi chọn dịch vụ phòng khách sạn
     * @param roomBedId id của dịch vụ phòng khách sạn
     */
    $scope.toggleSelectionRoomBed = function (roomBedId) {
        var index = $scope.filler.roomBedsIdListFilter.indexOf(roomBedId);
        if (index === -1) {
            $scope.filler.roomBedsIdListFilter.push(roomBedId);
        } else {
            $scope.filler.roomBedsIdListFilter.splice(index, 1);
        }
    }

    /**
     * Phương thức chọn miễn phí ăn sáng
     * @param freeBreakfast
     */
    $scope.toggleSelectionFreeBreakfast = function (freeBreakfast) {
        if (freeBreakfast === true) {
            $scope.filler.breakfastIncludedFilter = freeBreakfast;
        } else {
            $scope.filler.breakfastIncludedFilter = null;
        }
    }

    /**
     * Phương thức chọn miễn phí hủy phòng
     * @param freeCancellation
     */
    $scope.toggleSelectionFreeCancellation = function (freeCancellation) {
        if (freeCancellation === true) {
            $scope.filler.freeCancellationFilter = freeCancellation;
        } else {
            $scope.filler.freeCancellationFilter = null;
        }
    }

    /**
     * Phương thức bắt lỗi ngày nhận phòng và ngày trả phòng
     */
    $scope.validateDates = function () {
        $scope.currentDate = new Date();

        var checkInDate = new Date($scope.filler.checkInDateFiller);
        var checkOutDate = new Date($scope.filler.checkOutDateFiller);
        var currentDateNow = Math.floor(($scope.filler.checkInDateFiller - $scope.currentDate) / (1000 * 60 * 60 * 24))

        if (currentDateNow < -1) {
            $scope.errorCheckInDateFiller = "Ngày nhận phòng không thể nhỏ hơn ngày hiện tại";
        } else {
            $scope.errorCheckInDateFiller = "";
        }

        if (checkOutDate <= checkInDate) {
            $scope.errorCheckOutDateFiller = "Ngày trả phòng không thể trước ngày nhận phòng";
        } else {
            $scope.errorCheckOutDateFiller = "";
        }
    };

    /**
     * Phương thức tìm kiếm loại phòng qua các điều kiện lọc
     */
    HotelServiceCT.findAllRoomTypesByFillter($scope.filler).then(function successCallback(response) {
        $scope.loading = true;
        if (response.status === 200) {
            $scope.roomTypes = response.data.data;
            $scope.totalPages = Math.ceil(response.data.totalPages / $scope.filler.size);
        } else {
            $location.path('/admin/internal-server-error');
        }
    }).finally(function () {
        $scope.loading = false;
    });

    /**
     * Phương thức tìm kiếm tất cả loại phòng
     */
    HotelServiceCT.findAllHotelType().then(function successCallback(response) {
        if (response.status === 200) {
            $scope.hotelTypes = response.data.data;
        } else {
            $location.path('/admin/internal-server-error');
        }
    });

    /**
     * Phương thức lấy tất cả các dịch vụ của khách sạn
     */
    HotelServiceCT.findAllHotelUtilities().then(function successCallback(response) {
        if (response.status === 200) {
            $scope.placeUtilities = response.data.data;
        } else {
            $location.path('/admin/internal-server-error');
        }
    })

    /**
     * Phương thức lấy tất cả các loại giường
     */
    HotelServiceCT.findAllRoomBedType().then(function successCallback(response) {
        if (response.status === 200) {
            $scope.bedTypes = response.data.data;
        } else {
            $location.path('/admin/internal-server-error');
        }
    })

    /**
     * Phương thức lấy tất cả thông tin dịch vụ phòng khách sạn
     */
    HotelServiceCT.findAllRoomUtilities().then(function successCallback(response) {
        if (response.status === 200) {
            $scope.roomUtilities = response.data.data;
        } else {
            $location.path('/admin/internal-server-error');
        }
    })

    /**
     * Phương thức tìm kiếm khách sạn dựa vào thông tin filler khi click tìm kiếm
     */
    $scope.findAllRoomTypesByFillerClick = function () {
        HotelServiceCT.findAllRoomTypesByFillter($scope.filler).then(function successCallback(response) {
            if (response.status === 200) {
                $scope.roomTypes = response.data.data;
                $scope.totalPages = Math.ceil(response.data.totalPages / $scope.filler.size);
                $scope.daysBetween = Math.floor(($scope.filler.checkOutDateFiller - $scope.filler.checkInDateFiller) / (1000 * 60 * 60 * 24));
                $scope.addMarkers($scope.roomTypes);
            } else {
                $location.path('/admin/internal-server-error');
            }
        })
    }
    $scope.findAllRoomTypesByFillerClick()

    /**
     * Phương thức thay đổi id loại khách sạn thành tên loại khách sạn
     * @param hotelTypeId
     * @returns {null|*|string|string}
     */
    $scope.getHotelTypeName = function (hotelTypeId) {
        if (Array.isArray($scope.hotelTypes)) {
            var hotelType = $scope.hotelTypes.find(function (hotelType) {
                return hotelType.id === hotelTypeId;
            });
            return hotelType ? hotelType.hotelTypeName : '';
        } else {
            return '';
        }
    }

    /**
     * Phương thức thay đổi id loại giường thành tên loại giường
     * @param bedTypeId id loại giường
     * @returns {null|*|string|string} tên loại giường
     */
    $scope.getRoomBedsName = function (bedTypeId) {
        if (Array.isArray($scope.bedTypes)) {
            var bedType = $scope.bedTypes.find(function (bedType) {
                return bedType.id === bedTypeId;
            });
            return bedType ? bedType.bedTypeName : '';
        } else {
            return '';
        }
    }


    /**
     * Phương thức xử lí phân trang
     * @returns {*[]}
     */
    $scope.getPaginationRange = function () {
        var range = [];
        var start, end;

        if ($scope.totalPages <= 3) {
            start = 0;
            end = $scope.totalPages;
        } else {
            start = Math.max(0, $scope.filler.page - 1);
            end = Math.min(start + 3, $scope.totalPages);

            if (end === $scope.totalPages) {
                start = $scope.totalPages - 3;
            }
        }

        for (var i = start; i < end; i++) {
            range.push(i);
        }

        return range;
    };

    /**
     * Phương thức xử lí phân trang khi chuyển trang
     * @param page trang
     */
    $scope.setPage = function (page) {
        $scope.filler.page = page;
        $scope.getPaginationRange()
        if ($scope.filler.page < $scope.totalPages && $scope.filler.page > 0) {
            $scope.findAllRoomTypesByFillerClick();
            console.log($scope.filler.page)
        } else if ($scope.filler.page === $scope.totalPages) {
            $scope.filler.page = $scope.totalPages - 1;
            $scope.findAllRoomTypesByFillerClick();
        } else {
            $scope.filler.page = 0;
            $scope.findAllRoomTypesByFillerClick();
        }
    };

    /**
     * Phương thức hiển thị modal
     */
    $scope.showMapModal = function () {
        $('#mapModal').modal('show');
    };

    /**
     * Phương thức đóng modal
     */
    $scope.closeMapModal = function () {
        $('#mapModal').modal('hide');
    };

    /**
     * Phương thức set kích thước bản đồ
     */
    $('#mapModal').on('shown.bs.modal', function () {
        setTimeout(function () {
            $scope.map.resize();
        }, 200);
    });

    /**
     * Phương thức hiển thị modal
     */
    $scope.showMapModalByIdHotel = function (roomTypeId) {
        $('#mapBoxModelById').modal('show');
        RoomTypeService.findRoomTypesById(roomTypeId).then(function successCallback(response) {
            if (response.status === 200) {
                $scope.roomTypesById = response.data.data;
                $scope.addMarkersById($scope.roomTypesById);
            } else {
                $location.path('/admin/internal-server-error');
            }
        })
    };

    /**
     * Phương thức đóng modal
     */
    $scope.closeMapModalByIdHotel = function () {
        $('#mapBoxModelById').modal('hide');
    };

    /**
     * Phương thức set kích thước bản đồ
     */
    $('#mapBoxModelById').on('shown.bs.modal', function () {
        setTimeout(function () {
            $scope.mapById.resize();
        }, 100);
    });

    /**
     * Phương thức khởi tạo giao diện popup
     * @param roomType
     * @returns {string}
     */
    function createPopupContent(roomType) {
        return `
    <div class="m-1 fadeInUp row">
                        <div class="img-holder col-xl-3 col-lg-4 p-0">
                            <img src="${roomType.roomTypeAvatar}"
                                 onerror="this.src='/assets/admin/assets/img/bg/default-image-hotel.png'"/>

                        </div>
                        <div class=" col-xl-9 col-lg-8">
                            <div class="meta row">
                                <div class="col-lg-8 container-hotel">
                                    <div>
                                        <span>
                                            <i class="fa-solid fa-hotel"></i>
                                            <a>
                                                ${$scope.getHotelTypeName(roomType.hotelsByHotelId.hotelTypeId)}
                                            </a>
                                        </span>
                                        <h3 class="fw-medium"><a href="#">${roomType.hotelsByHotelId.hotelName}</a>
                                        </h3>
                                        <div class="d-flex align-items-center mb-3"
                                             style="border-bottom: 1px solid rgba(29, 35, 31, 0.1);">
                                            <div class="location text-orange" style="font-size: 14px">
                                                <p><span
                                                        class="fas fa-map-marker-alt"></span> ${ roomType.hotelsByHotelId.province } -
                                                    ${ roomType.hotelsByHotelId.district }</p>
                                                <p>${ roomType.hotelsByHotelId.address }</p>
                                            </div>
                                            <a href="#" class="btn text-green" style="font-size: 14px"
                                               ng-click="showMapModalByIdHotel(roomType.id)">
                                                Xem trên bản đồ</a>
                                        </div>
                                    </div>
                                    <div class="roomTypeByHotel mb-3"
                                         style="padding-left: 10px ;border-left: 1px solid rgba(29, 35, 31, 0.1)">
                                        <div style="font-size: 14px; line-height: 20px">
                                            <div class="fw-medium"
                                                 style="font-size: 15px">${roomType.roomTypeName}
                                            </div>
                                            <p class="fs-7 mb-1">Loại
                                                giường: ${$scope.getRoomBedsName(roomType.roomBedsById[0].bedTypeId)}</p>
                                            <div ${roomType.breakfastIncluded ? `
                                                <div class="text-green">
                                                    <i class="fa-solid fa-check"></i> Miễn phí ăn sáng
                                                </div> ` : ""}
                                            <div ${roomType.freeCancellation ? `
                                                <div class="text-green">
                                                    <i class="fa-solid fa-check"></i> Miễn phí hủy phòng
                                                </div> ` : ""}
                                            <div ${roomType.amountRoom <= 10 && roomType.amountRoom > 0 ? `
                                                <div class="text-danger mt-3 fw-bold">
                                                <i class="fa-solid fa-exclamation"></i> Chỉ
                                                còn ${roomType.amountRoom} phòng với giá này trên trang của chúng tôi
                                            </div>` : ""}
                                            <div ${roomType.amountRoom === 0 ? `
                                                <div class="text-danger mt-3 fw-bold">
                                                <i class="fa-solid fa-exclamation"></i> Phòng của khách sạn này đã hết nhưng đừng lo, bạn có thể chọn những phòng khác của khách sạn này
                                            </div>` : ""} 
                                            </div>
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
                                                <div class="amount-customer text-end">
                                                    <p>
                                                        ${roomType.capacityAdults} Người lớn *
                                                        ${roomType.capacityChildren} Trẻ em
                                                    </p>
                                                </div>
                                                <div class="fw-bold text-end"
                                                     style="font-size: 20px">${$scope.formatPrice(roomType.price * $scope.daysBetween)}
                                                    VND
                                                </div>
                                                <p class="fs-7 float-end"> ${$scope.daysBetween} Đêm </p>
                                                <a href="/hotel/hotel-detail" class="btn btn-green w-100 mt-3">
                                                    Xem chi tiết
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
        `;
    }

});