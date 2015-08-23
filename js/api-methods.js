

var wundergroundUrl = 'http://api.wunderground.com/api/ebf06033e08ca1b6/conditions/q/RI/Providence.json';

var apiCallWunderground= $.get(wundergroundUrl);

apiCallWunderground.done(function(data) {
    // success
    $('#conditions').append('<p>' +data.current_observation.weather+ '</p>');
    $('#temp').append('<p>' +data.current_observation.temp_f+ "° F" + '</p>');
    $('#mobile-temp').append('<p>' +data.current_observation.temp_f+ "° F" + '</p>');
    //console.log(data);
});

apiCallWunderground.fail(function(xhr, err) {
    // failure
        console.log('Unable to retrieve weather data');
});