travel_app.service('TourCusService', function ($http) {
    let API_TOUR = BASE_API + 'customer/tour/';

    this.findAllTourDetailCustomer = function (page, size) {
        return $http({
            method: 'GET',
            url: API_TOUR + 'find-tour-detail-customer',
            params: {
                page: page || 0,
                size: size || 5,
            }
        });
    };

    this.findAllTourDetailCustomerByFilters = function (page, size, sortBy, sortDir, filters) {
        return $http({
            method: 'GET',
            url: API_TOUR + 'find-tour-detail-customer-by-filters',
            params: {
                page: page || 0,
                size: size || 10,
                sortBy: sortBy || 'dateCreated',
                sortDir: sortDir || 'DESC',
                price: filters.price || null,
                tourTypeList: filters.tourTypeList || null,
                checkInDateFiller: filters.checkInDateFiller || null,
                departureArrives: filters.departureArrives || null,
                departureFrom: filters.departureFrom || null,
                numberOfPeople: filters.numberOfPeople || null,
                departure: filters.departure || null,
            }
        });
    };
    this.getAListOfPopularTours = function (page, size, sortBy, sortDir, filters) {
        return $http({
            method: 'GET',
            url: API_TOUR + 'getAListOfPopularTours',
            params: {
                page: page || 0,
                size: size || 10,
                sortBy: sortBy || 'dateCreated',
                sortDir: sortDir || 'DESC',
                price: filters.price || null,
                departure: filters.departure || null,
                departureArrives: filters.departureArrives || null,
                departureFrom: filters.departureFrom || null,
            }
        });
    };

    this.getAllTourDetail = function () {
        return $http({
            method: 'GET',
            url: API_TOUR + 'get-tour-detail-customer-data-list',
        });
    };

    this.findAllTourType = function () {
        return $http({
            method: 'GET',
            url: API_TOUR + 'find-all-tour-type'
        });
    }
});
