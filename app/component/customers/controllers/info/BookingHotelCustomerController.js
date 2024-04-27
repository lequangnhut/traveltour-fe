travel_app.controller("BookingHotelCustomerController", function ($scope, $sce,$timeout, $location, $window, $routeParams, UserCommentsService, SensitiveWordsService, HistoryOrderServiceCUS, Base64ObjectService) {
    $scope.isLoading = true;

    let userId = Base64ObjectService.decodeObject($routeParams.id);

    $scope.mess = ''
    $scope.cancelWithFee = false;

    $scope.bookingTourHotelList = [];
    $scope.roomTypeListCustomer = [];
    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.currentTab = 'pending';
    $scope.orderStatus = null;

    $scope.passDate = false;

    // Các biến được khai báo trước
    $scope.addClass = false;
    $scope.errorRateComment = null;
    $scope.selectedImage = null;
    $scope.selectedImages = [];
    $scope.isSubmitButtonDisabled = true;
    $scope.imageErrors = []
    $scope.selectedStars = 0;
    $scope.comment = null;
    $scope.showSuccessMessage = false;
    $scope.rateProductList = [];
    $scope.sensitiveWords = [];
    $scope.inputText = ""
    $scope.ratingService = {}
    $scope.ratingHotel = {}
    $scope.stars = [
        {active: false},
        {active: false},
        {active: false},
        {active: false},
        {active: false}
    ];

    /** Hàm trả trang lỗi*/
    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }


    //===============================================================================================================
    //phân trang
    $scope.setPage = function (page) {
        if (page >= 0 && page < $scope.totalPages) {
            $scope.currentPage = page;
            $scope.getBookingTourHotelList();
        }
    };

    $scope.getPaginationRange = function () {
        let range = [];
        let start, end;

        if ($scope.totalPages <= 3) {
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

    $scope.pageSizeChanged = function () {
        $scope.currentPage = 0;
        $scope.getBookingTourHotelList();
    };

    $scope.getDisplayRange = function () {
        return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
    };
    $scope.sortData = function (column) {
        $scope.sortBy = column;
        $scope.sortDir = ($scope.sortDir === 'asc') ? 'desc' : 'asc';
        $scope.getBookingTourHotelList();
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

    $scope.getBookingTourHotelList = function () {
        $scope.isLoading = true;
        HistoryOrderServiceCUS.getAllOrderHotelByInfo($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.orderStatus, userId)
            .then(function (response) {
                if (response.data.data === null || response.data.data.content.length === 0) {
                    $scope.bookingTourHotelList.length = 0;
                    $scope.showNull = $scope.orderStatus;
                    return;
                }
                $scope.bookingTourHotelList = response.data.data.content;
                $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                $scope.totalElements = response.data.data.totalElements;
                for (let i = 0; i < $scope.bookingTourHotelList.length; i++) {
                    HistoryOrderServiceCUS.getHotels($scope.bookingTourHotelList[i].orderHotelDetailsById[0].roomTypeId)
                        .then(function (hotels) {
                            if (hotels) {
                                $scope.bookingTourHotelList[i].hotel = hotels.data.data;
                            } else {
                                console.error("tourDetail is undefined or null");
                            }
                        });

                }

            }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    };

    $scope.getBookingTourHotelList();

    $scope.getChangeHotelStatus = function () {
        $scope.getBookingTourHotelList();
    }

    $scope.isCheckInPassed = function (checkInDate) {
        var currentDate = new Date();
        var departure = new Date(checkInDate);

        var checkDown = Math.ceil((departure - currentDate) / (1000 * 60 * 60 * 24));

        return checkDown <= 0 || checkDown === -0;
    };

    $scope.openHotelModal = function (data) {
        $('#hotelModal').modal('show');
        $scope.resetRating()
        $scope.bookingHotel = data;

        var promises = [];

        for (let i = 0; i < $scope.bookingTourHotelList.length; i++) {
            var promise = HistoryOrderServiceCUS.getOrderDetails($scope.bookingHotel.id)
                .then(function (rooms) {
                    $scope.roomTypeListCustomer = rooms.data.data;
                    for (let j = 0; j < $scope.roomTypeListCustomer.length; j++) {
                        if ($scope.roomTypeListCustomer[j].roomTypes.freeCancellation === false) {
                            $scope.cancelWithFee = true;
                            return;
                        }
                    }
                });
            promises.push(promise);
        }

        Promise.all(promises).then(function () {
            if ((data.orderStatus === 0 && data.paymentMethod === 'VPO') || $scope.cancelWithFee === false) {
                $scope.mess = "Bạn có muốn hủy phòng không ?";
                return;
            }
        });

        var currentDate = new Date();
        var departureDate = new Date(data.checkIn);
        var currentDateTime = currentDate.getTime();
        var departureDateTime = departureDate.getTime();
        var diffInDays = Math.ceil((departureDateTime - currentDateTime) / (1000 * 60 * 60 * 24)) - 1;

        if (diffInDays >= 2 && diffInDays <= 4) {
            $scope.mess = "Chi phí hủy là 50% trên tổng giá trị đơn. Bạn có muốn hủy phòng không ?";
        } else if (diffInDays <= 1) {
            $scope.mess = "Chi phí hủy là 100% trên tổng giá trị đơn. Bạn có muốn hủy phòng không ?";
        } else {
            $scope.mess = "Bạn có muốn hủy phòng không ?";
        }
        //console.log(diffInDays);

        $timeout(function() {
            UserCommentsService.findByOrderIdRating($scope.bookingHotel.id).then(function (response) {
                if (response.status === 200) {
                    $scope.ratingHotel = response.data
                    $scope.statusRating = $scope.bookingHotel.id === response.data.orderId;
                    $scope.isBeforeSevenDays = new Date($scope.ratingHotel.dateCreated.getDate() + 7) > new Date();
                } else if (response.status === 404) {
                    $scope.statusRating = $scope.bookingHotel.id === response.data.orderId;
                    $scope.isBeforeSevenDays = new Date($scope.ratingHotel.dateCreated.getDate() + 7) > new Date();
                } else {
                    toastAlert('error', response.data.message)
                }
            }).catch(function (error) {
            })
        },100)
    }


    $scope.closeHotelModal = function () {
        $('#hotelModal').modal('hide');
        $scope.resetRating()

    };

    $scope.hideReasonModal = function () {
        $('#hotelModal').modal('show');
    };

    $scope.cancelBookingHotelOrder = function (data) {
       function confirmDeleteType() {
            $scope.noted = $scope.cancel.reason;
            $scope.isLoading = true;
            HistoryOrderServiceCUS.cancelHotel(data.id, $scope.noted).then(function successCallback(response) {
                centerAlert('Thành công !', 'Đã hủy booking, mời người dùng check mail !', 'success');
                $('#hotelModal').modal('hide'); // Đóng modal khi thành công
                $('#delete-hotel-reason').modal('hide'); // Đóng modal khi thành công
                $scope.getBookingTourHotelList();
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        confirmAlert($scope.mess, confirmDeleteType);
    };

    $scope.resetRating = function () {
        $timeout(function () {
            $scope.selectedStars = 0
            if ($scope.selectedStars === 0) {
                for (let i = 0; i < $scope.stars.length; i++) {
                    $scope.stars[i].active = false;
                }
                $scope.showRateStarMessage = "";
            }
        })
    }

    /**
     * Phương thức hiển thị modal đánh giá
     * @param bookingHotel
     */
    $scope.openRatingHotelModal = function (bookingHotel) {
        $('#ratingHotelModal').modal('show');
        $('#hotelModal').modal('hide');
        $scope.ratingService = bookingHotel;
        $scope.selectedStars = 0

        SensitiveWordsService.findAllSensitiveWords().then(function successCallback(response) {
            if (response.status === 200) {
                $scope.sensitiveWords = response.data;
            } else {
                toastAlert('error', response.data.message)
            }
        }).catch(function (error) {
            toastAlert('error', error.data.message)
        });
        $scope.resetRating()
            $scope.inputText = null;
        $scope.isSubmitButtonDisabled =
            $scope.starError !== null ||
            $scope.errorRateComment !== null ||
            $scope.selectedStars === 0;
    }

    /**
     * Phương thức cập nhật lại đánh giá
     * @param bookingHotel
     */
    $scope.openUpdateRatingHotelModal = function (bookingHotel) {
        $('#ratingUpdateHotelModal').modal('show');
        $('#hotelModal').modal('hide');
        $scope.ratingService = bookingHotel;
        $scope.selectedStars = 0

        // Tìm từ cấm
        SensitiveWordsService.findAllSensitiveWords().then(function successCallback(response) {
            if (response.status === 200) {
                $scope.sensitiveWords = response.data;
            } else {
                toastAlert('error', response.data.message)
            }
        }).catch(function (error) {
            toastAlert('error', error.data.message)
        });
        $scope.resetRating()
        $scope.inputText = null;
        $scope.isSubmitButtonDisabled =
            $scope.starError !== null ||
            $scope.errorRateComment !== null ||
            $scope.selectedStars === 0;
    }

    $scope.closeRatingHotelModal = function () {
        $('#ratingHotelModal').modal('hide');
    }

    /**
     * Phương thức chọn sao đánh giá sản phẩm
     * @param index
     */
    $scope.toggleStar = function (index) {
        // Đảo trạng thái active của các sao từ 1 đến index
        for (let i = 0; i <= index; i++) {
            $scope.stars[i].active = true;
            $scope.starError = null;
        }
        for (let j = index + 1; j < $scope.stars.length; j++) {
            $scope.stars[j].active = false;
        }

        // Đặt giá trị số sao đã chọn
        $scope.selectedStars = index + 1;

        if ($scope.selectedStars === 5) {
            $scope.showRateStarMessage = "Rất hài lòng";
        } else if ($scope.selectedStars === 4) {
            $scope.showRateStarMessage = "Hài lòng";
        } else if ($scope.selectedStars === 3) {
            $scope.showRateStarMessage = "Bình thường";
        } else if ($scope.selectedStars === 2) {
            $scope.showRateStarMessage = "Tệ";
        } else if ($scope.selectedStars === 1) {
            $scope.showRateStarMessage = "Rất tệ";
        } else {
            $scope.showRateStarMessage = "";
        }

        $scope.isSubmitButtonDisabled =
            $scope.starError !== null ||
            $scope.errorRateComment !== null ||
            $scope.selectedStars === 0;

    };

    /**
     * Phương thức hover vào sao thì đổi màu của sao
     * @param index
     */
    $scope.hoverStar = function (index) {
        // Nếu như sao == 0 thì mới được phép hover
        if ($scope.selectedStars === 0) {
            for (let i = 0; i <= index; i++) {
                $scope.stars[i].active = true;
            }
            for (let j = index + 1; j < $scope.stars.length; j++) {
                $scope.stars[j].active = false;
            }

            if (index + 1 === 5) {
                $scope.showRateStarMessage = "Rất hài lòng";
            } else if (index + 1 === 4) {
                $scope.showRateStarMessage = "Hài lòng";
            } else if (index + 1 === 3) {
                $scope.showRateStarMessage = "Bình thường";
            } else if (index + 1 === 2) {
                $scope.showRateStarMessage = "Tệ";
            } else if (index + 1 === 1) {
                $scope.showRateStarMessage = "Rất tệ";
            } else {
                $scope.showRateStarMessage = "Không hợp lệ";
            }
        }
    };

    /**
     * Phuương thức reset lại sao khi không hover
     */
    $scope.resetStars = function () {
        // Đặt lại trạng thái của tất cả các ngôi sao khi di chuột ra khỏi ngôi sao
        if ($scope.selectedStars === 0) {
            for (let i = 0; i < $scope.stars.length; i++) {
                $scope.stars[i].active = false;
            }
            $scope.showRateStarMessage = "";
        }
    };

    /**
     * Phương thức kiểm tra từ cấm khi đánh giá
     * @param inputText
     */
    $scope.checkSensitive = function (inputText) {
        if (inputText !== "" && typeof inputText !== 'undefined') {
            var lowerInputText = inputText.toLowerCase();

            var isCheck = $scope.sensitiveWords.some(function (word) {
                if (typeof word !== "string") {
                    // Kiểm tra nếu phần tử không phải là chuỗi, bỏ qua và trả về false
                    return false;
                }
                var lowerWord = word.toLowerCase();

                if (lowerInputText.includes(" " + lowerWord + " ") || lowerInputText.startsWith(lowerWord + " ") || lowerInputText.endsWith(" " + lowerWord)) {
                    return true;
                }

                if (lowerInputText.includes(lowerWord)) {
                    var index = lowerInputText.indexOf(lowerWord);
                    if ((index === 0 || lowerInputText[index - 1] === " ") && (index + lowerWord.length === lowerInputText.length || lowerInputText[index + lowerWord.length] === " ")) {
                        return true;
                    }
                }

                return false;
            });

            if (isCheck) {
                $scope.errorRateComment = 'Phát hiện từ ngữ thô tục, vui lòng kiềm chế!';
            } else {
                $scope.inputText = inputText;
                $scope.errorRateComment = null;
            }

            $scope.isSubmitButtonDisabled =
                $scope.starError !== null ||
                $scope.errorRateComment !== null ||
                $scope.selectedStars === 0;
        }
    };


    /**
     * Phương thức mở model thì lưu productID
     * @param productId
     * @param orderId
     */
    $scope.openReviewModal = function (productId, orderId) {
        $scope.selectedProductId = productId;
        $scope.selectedOrdertId = orderId;
    };

    $scope.resetSuccessMessage = function () {
        $scope.showSuccessMessage = false;
    };

    /**
     * Phương thức gửi đánh giá
     * @param status trạng thái đánh giá
     */
    $scope.submitRating = function (status) {
        if(status === 'insert') {
            $scope.data = {
                serviceId: $scope.ratingService.hotel.id,
                star: $scope.selectedStars,
                content: $scope.inputText,
                usersId: $scope.user.id,
                orderId: $scope.ratingService.id
            }
            UserCommentsService.insertUserComments($scope.data).then(function (response) {
                if (response.status === 200) {
                    toastAlert('success', response.data.message)
                    $('#ratingHotelModal').modal('hide');
                    $scope.resetRating()

                } else {
                    toastAlert('error', response.data.message)
                }
            }).catch(function (error) {
                toastAlert('error', error.data.message)
            })
        }else if(status === 'update'){
            $scope.data = {
                id: $scope.ratingHotel.id,
                serviceId: $scope.ratingService.hotel.id,
                star: $scope.selectedStars,
                content: $scope.inputText,
                usersId: $scope.user.id,
                orderId: $scope.ratingService.id
            }
            UserCommentsService.updateUserComments($scope.data).then(function (response) {
                if (response.status === 200) {
                    toastAlert('success', response.data.message)
                    $('#ratingUpdateHotelModal').modal('hide');

                    $scope.resetRating()

                } else {
                    toastAlert('error', response.data.message)
                }
            }).catch(function (error) {
                toastAlert('error', error.data.message)
            })
        }

    }
})