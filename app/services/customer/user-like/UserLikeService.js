travel_app.service("UserLikeService", function ($http) {
    let API_USER_LIKE = BASE_API + "customer/user-like/";

    /**
     * Phương thức tìm kiếm tất cả lượt thích của người dùng
     * @returns {*}
     */
    this.findAllUserLikeByUserId = function (usersId) {
        return $http({
            method: 'GET',
            url: API_USER_LIKE + 'findAllUserLikeByUserId',
            params: {
                usersId: usersId
            }
        })
    }

    /**
     * Phương thức tìm kiếm lượt thích của dịch vụ đó
     * @returns {*}
     */
    this.findUserLikeByCategoryIdAndServiceId = function (serviceId, userId) {
        return $http({
            method: 'GET',
            url: API_USER_LIKE + 'findUserLikeByCategoryIdAndServiceId',
            params: {
                serviceId: serviceId,
                userId: userId
            }
        })
    }

    /**
     * Phương thức lưu thông tin lượt thích của khách sạn
     * @param categoryId
     * @param serviceId Mã của dịch vụ (Ví dụ khách sạn)
     * @param userId mã người dùng
     * @returns {*}
     */
    this.saveLike = function (serviceId, categoryId, userId) {
        return $http({
            method: 'POST',
            url: API_USER_LIKE +'saveLike',
            params: {
                serviceId: serviceId,
                categoryId : categoryId,
                userId: userId
            }
        })
    }
})