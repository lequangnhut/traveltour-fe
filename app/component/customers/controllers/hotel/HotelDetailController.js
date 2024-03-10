travel_app.controller('HotelDetailController', function ($scope, $anchorScroll, $window, $routeParams, $location, HotelServiceCT, RoomTypeServiceCT, Base64ObjectService) {
    $scope.encryptedData = $routeParams.encryptedData;
    mapboxgl.accessToken = 'pk.eyJ1IjoicW5odXQxNyIsImEiOiJjbHN5aXk2czMwY2RxMmtwMjMxcGE1NXg4In0.iUd6-sHYnKnhsvvFuuB_bA';

    $anchorScroll();

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
        amountRoomSelected: null,
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
        capacityAdultsFilter: 2,
        capacityChildrenFilter: 0,
        checkInDateFiller: new Date(),
        checkOutDateFiller: new Date(),
        hotelIdFilter: null,
        page: 0,
        size: 10,
        sort: null
    }

    $scope.roomTypeSelected = []

    $scope.filler = JSON.parse(atob($scope.encryptedData));

    $scope.filler.checkInDateFiller = new Date($scope.filler.checkInDateFiller);
    $scope.filler.checkOutDateFiller = new Date($scope.filler.checkOutDateFiller);
    console.log(JSON.parse(atob($scope.encryptedData)))

    $scope.$on('$routeChangeSuccess', function () {
        $('.slider-active-5-item').slick({
            dots: false,
            arrows: false,
            infinite: true,
            speed: 800,
            autoplay: true,
            slidesToShow: 5,
            slidesToScroll: 1,
            prevArrow: '<div class="prev"><i class="far fa-arrow-left"></i></div>',
            nextArrow: '<div class="next"><i class="far fa-arrow-right"></i></div>',
            responsive: [{
                breakpoint: 1400, settings: {
                    slidesToShow: 4
                }
            }, {
                breakpoint: 1199, settings: {
                    slidesToShow: 3
                }
            }, {
                breakpoint: 991, settings: {
                    slidesToShow: 2
                }
            }, {
                breakpoint: 575, settings: {
                    slidesToShow: 1
                }
            }]
        });
    });

    /**
     * Phương thức tìm kiếm loại phòng qua các điều kiện lọc
     */
    RoomTypeServiceCT.findAllRoomTypesByEncryptedData($scope.encryptedData).then(function successCallback(response) {
        $scope.loading = true;
        if (response.status === 200) {
            $scope.roomTypes = response.data.data;
            $scope.countSize = response.data.totalPages;
            $scope.encryptedData = btoa(JSON.stringify($scope.filler));
            console.log($scope.roomTypes)
        } else {
            $location.path('/admin/internal-server-error');
        }
    }).finally(function () {
        $scope.loading = false;
    });

    /**
     * Phương thức tìm kiếm loại phòng qua các điều kiện lọc
     */
    $scope.searchRoomTypes = function () {
        RoomTypeServiceCT.findAllRoomTypesByEncryptedData($scope.encryptedData).then(function successCallback(response) {
            $scope.loading = true;
            if (response.status === 200) {
                $scope.roomTypes = response.data.data;
                $scope.countSize = response.data.totalPages;
                $scope.encryptedData = btoa(JSON.stringify($scope.filler));
                console.log($scope.roomTypes)
            } else {
                $location.path('/admin/internal-server-error');
            }
        }).finally(function () {
            $scope.loading = false;
        });
    }

    /**
     * Phương thức hiển thị phòng khách sạn đã xem gần đây
     * @returns {any|*[]}
     */
    $scope.getRoomTypeViewed = function () {
        var roomTypeViewed = $window.localStorage.getItem('historyWatchHotels');
        if (roomTypeViewed) {
            return JSON.parse(roomTypeViewed);
        } else {
            return [];
        }
    }

    $scope.roomTypeViewed = $scope.getRoomTypeViewed();

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
     * Phương thức tìm kiếm chi tiết loại phòng
     * @param hotelTypeId mã loại phòng
     * @returns {null|*|string|string} tên loại phòng
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
     * Tạo số phòng từ 1 đến số phòng
     * @param amountRoom số lượng phòng
     * @returns {[]} số lượng phòng từ 1 đến số phòng
     */
    $scope.generateRoomNumbers = function (amountRoom) {
        $scope.numberOfRooms = [];
        for (var i = 1; i <= amountRoom; i++) {
            $scope.numberOfRooms.push(i);
        }
        return $scope.numberOfRooms;
    };

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

    $scope.selectedRoomType = function (selectedRoomType, roomType) {
        var index = $scope.roomTypeSelected.findIndex(item => item.id === roomType.id);

        if (index === -1) {
            if (selectedRoomType !== null && selectedRoomType !== 0 && selectedRoomType !== undefined) {
                $scope.roomTypeSelected.push(roomType);
                roomType.amountRoomSelected = selectedRoomType;
            }
        } else {
            if (selectedRoomType === null || selectedRoomType === 0 || selectedRoomType === undefined) {
                $scope.roomTypeSelected.splice(index, 1);
            } else {
                $scope.roomTypeSelected[index].amountRoomSelected = selectedRoomType;
            }
        }

        console.log($scope.roomTypeSelected);
    };



    $scope.totalAmountRoomSelected = function () {
        var total = 0;
        for (var i = 0; i < $scope.roomTypeSelected.length; i++) {
            total += $scope.roomTypeSelected[i].amountRoomSelected * $scope.roomTypeSelected[i].price
        }
        return total;
    }

    $scope.paymentHotelNow = function () {
        $scope.selectedData = $scope.roomTypeSelected.map(function(roomType) {
            return {
                id: roomType.id,
                amountRoomSelected: roomType.amountRoomSelected
            };
        });
        $scope.roomTypeSelected.checkInDate = $scope.filler.checkInDateFiller;
        $scope.roomTypeSelected.checkOutDate = $scope.filler.checkOutDateFiller;

        $window.localStorage.setItem('roomTypeSelected', JSON.stringify($scope.roomTypeSelected));
        $window.localStorage.setItem('fillerHotel', JSON.stringify($scope.filler));
    }



});