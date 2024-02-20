travel_app.service('GoogleMapsService', function () {
    let script = null;

    this.loadMapsApi = function () {
        if (!script) {
            script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBDfIEHafrK1VwPYvWS2nRCpku4lhtKwLI&libraries=places';
            document.body.appendChild(script);
        }
    };
});