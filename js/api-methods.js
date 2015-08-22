var foursquareUrl='https://api.foursquare.com/v2/venues/search?ll=41.8278122,-71.4002354&client_id=WGP24ZPE3M4UTYO3STK2KU0XTLA4V4C5R3GUHQL5DJRFCKIA&client_secret=A1SD3AFP1YDTU1ATMYV4BFVX1V421CFBQQXB1Y2XZXZ2LVPW&v=20150819';

var apiCallFoursquare= $.get(foursquareUrl);

apiCallFoursquare.done(function(data) {
    // success
    //console.log('api test success');
    //$nav.append(data.response.venues[0].name);
    //console.log(data.response.venues[0].name);
    //console.log(data.response.venues[0].contact.formattedPhone);
    //console.log(data.response.venues[0].categories[0].icon.prefix + data.response.venues[0].categories[0].icon.suffix);
    //console.log(data.response.venues[0].menu.anchor);
});

apiCallFoursquare.fail(function(xhr, err) {
    // failure
        //console.log('api test fail');
});

var wundergroundUrl = 'http://api.wunderground.com/api/ebf06033e08ca1b6/conditions/q/RI/Providence.json';

var apiCallWunderground= $.get(wundergroundUrl);

apiCallWunderground.done(function(data) {
    // success
    $('#conditions').append('<p>' +data.current_observation.weather+ '</p>');
    $('#temp').append('<p>' +data.current_observation.temp_f+ "° F" + '</p>');
    $('#mobile-temp').append('<p>' +data.current_observation.temp_f+ "° F" + '</p>');
    console.log(data);
});

apiCallWunderground.fail(function(xhr, err) {
    // failure
        console.log('api test fail');
});