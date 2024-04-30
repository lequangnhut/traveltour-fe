travel_app.controller('HotelDetailController', function ($scope, $anchorScroll, $timeout, $window, $sce, $routeParams, $location, AuthService, UserCommentsService, UserLikeService, HotelServiceCT, RoomTypeServiceCT, LocalStorageService, AgenciesServiceAG, Base64ObjectService) {
    $scope.encryptedData = $routeParams.encryptedData;
    mapboxgl.accessToken = 'pk.eyJ1IjoicW5odXQxNyIsImEiOiJjbHN5aXk2czMwY2RxMmtwMjMxcGE1NXg4In0.iUd6-sHYnKnhsvvFuuB_bA';

    let user = null
    user = AuthService.getUser();

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

    if (!localStorage.getItem('filterHotels')) {
        var today = new Date();

        var tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

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
            checkInDateFiller: today,
            checkOutDateFiller: tomorrow,
            hotelIdFilter: null,
            page: 0,
            size: 10,
            sort: null
        };

        $scope.filler.checkInDateFiller = new Date($scope.filler.checkInDateFiller);
        $scope.filler.checkOutDateFiller = new Date($scope.filler.checkOutDateFiller);

        $scope.filler.checkOutDateFiller.setDate($scope.filler.checkOutDateFiller.getDate() + 1);

        localStorage.setItem('filterHotels', JSON.stringify($scope.filler));
    }

    $scope.updateFilter = function() {
        $scope.fillerUpdate = JSON.parse(localStorage.getItem('filterHotels'));
        $scope.fillerUpdate.checkInDateFiller = $scope.filler.checkInDateFiller
        $scope.fillerUpdate.checkOutDateFiller = $scope.filler.checkOutDateFiller
        $scope.fillerUpdate.capacityChildrenFilter = $scope.filler.capacityChildrenFilter
        $scope.fillerUpdate.capacityAdultsFilter = $scope.filler.capacityAdultsFilter

        localStorage.setItem('filterHotels', JSON.stringify($scope.fillerUpdate));
    }

    $scope.filler = JSON.parse(localStorage.getItem('filterHotels'));
    $scope.filler.checkInDateFiller = new Date($scope.filler.checkInDateFiller);
    $scope.filler.checkOutDateFiller = new Date($scope.filler.checkOutDateFiller);

    $scope.roomTypeSelected = []
    $scope.activeTabIndex = 0;

    $scope.page = null;
    $scope.size = null;

    $scope.listImage = {}
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
     * Phương thức tính số ngày giữa 2 ngày
     * @returns {number} số ngày giữa 2 ngày
     */
    $scope.calculateDaysBetween = function () {
        return Math.floor(($scope.filler.checkInDateFiller, $scope.filler.checkOutDateFiller) / (1000 * 60 * 60 * 24));
    };

    /**
     * Phương thức tìm kiếm loại phòng qua các điều kiện lọc
     */
    RoomTypeServiceCT.findAllRoomTypesByEncryptedData($scope.encryptedData).then(function successCallback(response) {
        $scope.listImageroomType = []
        $scope.loading = true;

        if (response.status === 200) {
            $scope.roomTypes = response.data.data;
            $scope.countSize = response.data.totalPages;

            $scope.countRoomTypeImage = 0

            $scope.roomTypes.forEach(function (roomType) {
                $scope.countRoomTypeImage += roomType.roomImagesById.length;
                $scope.listImageroomType.push(...roomType.roomImagesById);
                $scope.listImage = $scope.listImageroomType
                $scope.daysBetween = Math.floor(($scope.filler.checkOutDateFiller - $scope.filler.checkInDateFiller) / (1000 * 60 * 60 * 24));
            })
            $scope.checkIsLikeHotel($scope.roomTypes[0].hotelsByHotelId.id)
            $scope.findUserComments($scope.roomTypes[0].hotelsByHotelId.id)
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
        $scope.updateFilter()
        $location.path('/hotel');
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
    $scope.errorCheckInDateFiller = "";
    $scope.validateDates = function () {
        $scope.currentDate = new Date();

        var checkInDate = new Date($scope.filler.checkInDateFiller);
        var checkOutDate = new Date($scope.filler.checkOutDateFiller);
        var currentDateNow = Math.floor(($scope.filler.checkInDateFiller - $scope.currentDate) / (1000 * 60 * 60 * 24))

        if (currentDateNow < -1) {
            $scope.errorCheckInDateFiller = "Ngày nhận phòng không thể nhỏ hơn ngày hiện tại";
        } else {
            $scope.errorCheckInDateFiller = "";
            $scope.updateFilter()
        }

        if (checkOutDate <= checkInDate) {
            $scope.errorCheckOutDateFiller = "Ngày trả phòng không thể trước ngày nhận phòng";
        } else {
            $scope.errorCheckOutDateFiller = "";
            $scope.updateFilter()
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
    };


    $scope.totalAmountRoomSelected = function () {
        var total = 0;
        for (var i = 0; i < $scope.roomTypeSelected.length; i++) {
            total += $scope.roomTypeSelected[i].amountRoomSelected * $scope.roomTypeSelected[i].price
        }
        return total;
    }

    $scope.paymentHotelNow = function () {
        $window.localStorage.removeItem('roomTypeSelected');
        $scope.selectedData = $scope.roomTypeSelected.map(function (roomType) {
            return {
                id: roomType.id,
                amountRoomSelected: roomType.amountRoomSelected
            };
        });
        $scope.filler = JSON.parse(atob($scope.encryptedData));
        $scope.filler.roomTypeSelected = new Date($scope.filler.checkInDateFiller);
        $scope.filler.roomTypeSelected = new Date($scope.filler.checkOutDateFiller);

        $scope.roomTypeSelected.checkInDate = $scope.filler.checkInDateFiller;
        $scope.roomTypeSelected.checkOutDate = $scope.filler.checkOutDateFiller;

        $window.localStorage.setItem('roomTypeSelected', JSON.stringify($scope.roomTypeSelected));
        $window.location.href = '/hotel/hotel-details/payment';
    }

    $scope.redirectToChatHotel = function (agencyId) {
        RoomTypeServiceCT.findUserByAgencyId(agencyId).then(function successCallback(response) {
            if (response.status === 200) {
                $scope.agencyId = response.data.data.userId;
                var encodedId = btoa($scope.agencyId);
                console.log(user)
                if (user == null) {
                    LocalStorageService.set("redirectAfterLogin", "/hotel/hotel-details");
                    $location.path('/sign-in');
                } else {
                    $location.path('/chat/' + encodedId);
                }

            } else {
                $location.path('/admin/internal-server-error');
            }
        })

    }

    $scope.trustHtmls = function (html) {
        $timeout(function () {
            return $sce.trustAsHtml(html);
        }, 100)

    };

    /**
     * Phương thức hiển thị modal
     */
    $scope.showImageHotelModal = function () {
        $('#imageHotelModal').modal('show');
    };

    /**
     * Phương thức đóng modal
     */
    $scope.closeImageHotelModal = function () {
        $('#imageHotelModal').modal('hide');
    };

    $scope.updateRoomImages = function (roomTypeIndex) {
        $scope.loading = true;
        console.log(roomTypeIndex);

        var promise = new Promise(function (resolve, reject) {
            if (roomTypeIndex === -1) {
                $scope.listImage = $scope.listImageroomType;
                resolve();
            } else {
                $scope.listImage = $scope.roomTypes[roomTypeIndex].roomImagesById;
                resolve();
            }
        });

        promise.then(function () {
            $scope.loading = false;
        });
    };


    /**
     * Phương thức đóng modal
     */
    $scope.closeInfoRoomTypeModal = function () {
        $('#infoRoomType').modal('hide');
    };

    $scope.showInfoRoomType = function (id) {
        $('#infoRoomType').modal('show');

        return new Promise(function (resolve, reject) {
            var roomType = $scope.roomTypes.find(function (roomType) {
                return roomType.id === id;
            });
            console.log(roomType)

            if (roomType) {
                $scope.infoRoomType = roomType;
                resolve(roomType);
            } else {
                reject('Không tìm thấy phòng với ID: ' + id);
            }
        })
    };

    $scope.likeHotel = function (serviceId) {
        $scope.category = 1
        if (user != null && user != undefined && user) {
            UserLikeService.saveLike(serviceId, $scope.category, user.id).then(function (response) {
                if (response.status === 200) {
                    toastAlert('success', response.data.message)
                    $scope.playSuccessSound()
                    $scope.checkIsLikeHotel(serviceId)
                } else {
                    toastAlert('error', response.data.message)
                }
            })
        } else {
            toastAlert('error', "Vui lòng đăng nhập để thích khách sạn này")
        }
    }
    $scope.isLikeHotel = false;
    $scope.checkIsLikeHotel = async function (serviceId) {
        try {
            const response = await UserLikeService.findUserLikeByCategoryIdAndServiceId(serviceId, user.id);
            if (response.status === 200 && response.data.status === "200") {
                $scope.isLikeHotel = response.data.data;
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