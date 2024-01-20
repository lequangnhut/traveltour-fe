travel_app.service('HotelServiceAG', function ($http) {
    let API_HOTELS = BASE_API + 'agent/hotels/';

    this.findByAgencyId = function (userId) {
        return $http({
            method: 'GET',
            url: API_HOTELS + 'find-by-agency-id/' + userId
        })
    }

    /**
     * Lấy danh sách khách sạn
     */
    this.getListHotel = function (listHotels) {
        return $http({
            method: 'GET',
            url: API_HOTELS + 'list-hotels',
            data: listHotels
        })
    };

    /**
     * Lấy danh sách check box
     */
    this.getListPlaceUtilities = function () {
        return $http({
            method: "GET",
            url: API_HOTELS + "list-place-utilities"
        });
    };


    /**
     * Thêm khách sạn mới
     * @param dataHotels dữ liệu thông tin khách sạn
     * @returns {*}
     */
    this.registerHotels = function (dataHotels) {
        return $http({
            method: 'POST',
            url: API_HOTELS + 'information-hotel/register-hotels',
            headers: {'Content-Type': undefined},
            data: dataHotels,
            transformRequest: angular.identity,
        });
    }
})