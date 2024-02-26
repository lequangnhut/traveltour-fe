travel_app.controller('HotelCustomerController', function ($scope, $location, $window, $anchorScroll, HotelServiceCT) {
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

    $scope.filler = {
        priceFilter: 3000000,
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
        size: 10
    }

    $scope.totalPages = 0;

    $scope.filler.checkOutDateFiller.setDate($scope.filler.checkOutDateFiller.getDate() + 1);
    $scope.daysBetween = Math.floor(($scope.filler.checkOutDateFiller - $scope.filler.checkInDateFiller) / (1000 * 60 * 60 * 24));
    $scope.ratings = [
        {id: 1, label: 'Trên 1 sao'},
        {id: 2, label: 'Trên 2 sao'},
        {id: 3, label: 'Trên 3 sao'},
        {id: 4, label: 'Trên 4 sao'},
        {id: 5, label: 'Trên 5 sao'}
    ];

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
            hotelTypesByHotelTypeId: {
                id: null,
                hotelTypeName: null,
                hotelsById: null,
            },

        },
    }


    $scope.hotelTypes = {
        id: null,
        hotelTypeName: null,
        hotelsById: null,
    }

    $scope.placeUtilities = {
        id: null,
        placeUtilitiesName: null,
    }

    $scope.bedTypes = {
        id: null,
        bedTypeName: null,
    }

    $scope.checkboxModel = {
        freeBreakfast: false,
        freeCancellation: false
    };

    $scope.roomUtilities = {
        id: null,
        roomUtilitiesName: null,
    }

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

    $scope.calculateDaysBetween = function() {
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
     * Phương thức kiểm rta giá có đúng định dạng số không
     */
    $scope.checkPriceFormat = function () {
        // Kiểm tra xem giá có đúng định dạng số không
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

    $scope.toggleSelectionFreeBreakfast = function (freeBreakfast) {
        if (freeBreakfast === true) {
            $scope.filler.breakfastIncludedFilter = freeBreakfast;
        } else {
            $scope.filler.breakfastIncludedFilter = null;
        }
    }

    $scope.toggleSelectionFreeCancellation = function (freeCancellation) {
        if (freeCancellation === true) {
            $scope.filler.freeCancellationFilter = freeCancellation;
        } else {
            $scope.filler.freeCancellationFilter = null;
        }
    }

    $scope.validateDates = function () {
        $scope.currentDate = new Date(); // Cập nhật ngày hiện tại

        var checkInDate = new Date($scope.filler.checkInDateFiller);
        var checkOutDate = new Date($scope.filler.checkOutDateFiller);
        var currentDateNow = Math.floor(($scope.filler.checkInDateFiller - $scope.currentDate) / (1000 * 60 * 60 * 24))
        console.log(currentDateNow);
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

    HotelServiceCT.findAllRoomTypesByFillter($scope.filler).then(function successCallback(response) {
        $scope.loading = true;
        if (response.status === 200) {
            $scope.roomTypes = response.data.data;
            $scope.totalPages = Math.ceil(response.data.totalPages / $scope.filler.size);
            console.log(response);
            console.log($scope.filler);
        } else {
            // $location.path('/admin/internal-server-error');
        }
    }).finally(function () {
        $scope.loading = false;
    });

    HotelServiceCT.findAllHotelType().then(function successCallback(response) {
        if (response.status === 200) {
            $scope.hotelTypes = response.data.data;
        } else {
            // $location.path('/admin/internal-server-error');
        }
    });

    HotelServiceCT.findAllHotelUtilities().then(function successCallback(response) {
        if (response.status === 200) {
            $scope.placeUtilities = response.data.data;
        } else {
            // $location.path('/admin/internal-server-error');
        }
    })

    HotelServiceCT.findAllRoomBedType().then(function successCallback(response) {
        if (response.status === 200) {
            $scope.bedTypes = response.data.data;
        } else {
            // $location.path('/admin/internal-server-error');
        }
    })

    HotelServiceCT.findAllRoomUtilities().then(function successCallback(response) {
        if (response.status === 200) {
            $scope.roomUtilities = response.data.data;
        } else {
            // $location.path('/admin/internal-server-error');
        }
    })

    $scope.findAllRoomTypesByFillerClick = function () {
        console.log("Gọi phương thức này")
        HotelServiceCT.findAllRoomTypesByFillter($scope.filler).then(function successCallback(response) {
            if (response.status === 200) {
                $scope.roomTypes = response.data.data;
                $scope.getPaginationRange();
                $scope.totalPages = Math.ceil(response.data.totalPages / $scope.filler.size);
                $scope.daysBetween = Math.floor(($scope.filler.checkOutDateFiller - $scope.filler.checkInDateFiller) / (1000 * 60 * 60 * 24));
                console.log(response);
            } else {
                // $location.path('/admin/internal-server-error');
            }
        })
    }

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
            // Nếu tổng số trang nhỏ hơn hoặc bằng 5, hiển thị tất cả các trang
            start = 0;
            end = $scope.totalPages;
        } else {
            // Hiển thị 2 trang trước và 2 trang sau trang hiện tại
            start = Math.max(0, $scope.filler.page - 1);
            end = Math.min(start + 3, $scope.totalPages);

            // Điều chỉnh để luôn hiển thị 5 trang
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
     * @param page
     */
    $scope.setPage = function (page) {
        $scope.filler.page = page;
        $scope.getPaginationRange()
        if ($scope.filler.page < $scope.totalPages && $scope.filler.page > 0) {
            $scope.findAllRoomTypesByFillerClick(); // Gọi lại hàm để lấy dữ liệu của trang mới
            console.log($scope.filler.page)
        } else if ($scope.filler.page === $scope.totalPages) {
            $scope.filler.page = $scope.totalPages - 1;
            $scope.findAllRoomTypesByFillerClick(); // Gọi lại hàm để lấy dữ liệu của trang mới
        } else {
            $scope.filler.page = 0;
            $scope.findAllRoomTypesByFillerClick(); // Gọi lại hàm để lấy dữ liệu của trang mới
        }
    };

    var viewedHotels = JSON.parse($window.localStorage.getItem('viewedHotels')) || [];

    // Hàm để thêm sản phẩm vào danh sách đã xem
    $scope.addViewedHotel = function(roomType) {
        // Kiểm tra xem sản phẩm đã tồn tại trong danh sách chưa
        if (!viewedHotels.some(function(viewedProduct) { return viewedProduct.id === product.id; })) {
            viewedHotels.push(product);
            $window.localStorage.setItem('viewedProducts', JSON.stringify(viewedHotels));
        }
    };

});