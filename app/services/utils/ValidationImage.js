travel_app.service("ValidationImagesService", function ($http) {

    this.validationImage = function (file) {

        var formData = new FormData();
        formData.append('media', file);
        formData.append('models', 'nudity-2.0,offensive,gore');
        formData.append('api_user', '213214100');
        formData.append('api_secret', '53gtAe6wLjXDyxUur4pebMoDnJf78Z3M');

        return $http({
            method: 'POST',
            url: 'https://api.sightengine.com/1.0/check.json',
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    }

})