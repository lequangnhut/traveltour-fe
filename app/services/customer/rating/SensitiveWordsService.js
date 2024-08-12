travel_app.service('SensitiveWordsService', function ($http) {
    let API_SENSITIVE_WORDS = BASE_API +'customer/sensitive-words/';

    this.findAllSensitiveWords = function () {
        return $http({
            method: 'GET',
            url: API_SENSITIVE_WORDS + 'findAllSensitiveWords'
        })
    }
})