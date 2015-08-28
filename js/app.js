var map;
function initMap() {
  //Set map options for Google map
  var mapOptions = {
    center: new google.maps.LatLng(41.825283, -71.4126816),
    zoom: 15
  };
  //create map
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
};

$(document).ready(function(){
  "use strict"

  //browse icon glows yellow on hover
  $('#searchFS-btn').on('mouseover', function(){
    $('#searchFS-btn').attr("src", "img/browse-hover.png");
  });

  //browse icon remove glow when mouse leaves
  $('#searchFS-btn').on('mouseleave', function(){
    $('#searchFS-btn').attr("src", "img/browse.png");
  });
initMap();

    //--------------------------------------Start MODEL----------------------------------------------------
    var Model = function(data){

        //Set attributes for places
        this.title = data.title;
        this.category = data.category;
        this.newMarker = function(){
          this.marker = new google.maps.Marker({
          position: new google.maps.LatLng(data.lat, data.lng),
          icon: data.markerIcon,
          title: data.title,
          placeInfo : data.placeInfo,
          map: map,
          url: data.url,
          animation: google.maps.Animation.DROP
        });
      };
    };

    //--------------------------------------Start VIEWMODEL---------------------------------------------
    var ViewModel = function(){

      var self = this;

      //Create observable array this.placeList
      this.placeList = ko.observableArray([]);

      //Add places to placeList
      places.forEach(function(placeItem){
      self.placeList().push(new Model(placeItem));
    });

    var placeLength = self.placeList().length;

    //create markers for all places
    this.allMarkers = function() {
      for(var i=0; i < placeLength; i++){
        self.placeList()[i].newMarker();
      };
    };
    this.allMarkers();

    var infoPlaces = [];

    for(var i=0; i < placeLength; i++){
      self.placeList()[i].marker.placeInfo = ko.observable('');
    };

    //get data from Foursquare about places on the map
    var getPlaceData = function(){
      for(var i=0; i < placeLength; i++){
        //define latitude-longitude variable for each place
        var placeLL =  self.placeList()[i].marker.position.G + ',' + self.placeList()[i].marker.position.K;
        var foursquareUrl='https://api.foursquare.com/v2/venues/search?ll=' +placeLL+ '&client_id=WGP24ZPE3M4UTYO3STK2KU0XTLA4V4C5R3GUHQL5DJRFCKIA&client_secret=A1SD3AFP1YDTU1ATMYV4BFVX1V421CFBQQXB1Y2XZXZ2LVPW&v=20150819';

        $.getJSON(foursquareUrl, function(data) {
          dataType: "jsonp";
            var place = {
              name: data.response.venues[0].name,
              phone: data.response.venues[0].contact.formattedPhone,
              id: data.response.venues[0].id,
              url: data.response.venues[0].url,
            };
            infoPlaces.push(place);
        })

        //sort places alphabetically
        //http://stackoverflow.com/questions/6712034/sort-array-by-firstname-alphabetically-in-javascript
        function addPlaceInfo(){
          infoPlaces.sort(function(a, b){
            if(a.name < b.name) return -1;
            if(a.name > b.name) return 1;
            return 0;
        })

        //add API data from Foursquare to the info windows
          for(var i=0; i < placeLength; i++) {
            self.placeList()[i].marker.placeInfo('<h2 id="iw-title">' +infoPlaces[i].name+ '</h2>' +
            '<p>Phone: ' +infoPlaces[i].phone+ '</p>' +
            '<a href="' +infoPlaces[i].url+ '" target="_blank">website</a>' +
            '<a href="https://foursquare.com/v/' +infoPlaces[i].id+ '" target="_blank"><img src="https://ss0.4sqi.net/img/poweredByFoursquare/poweredby-one-color-cdf070cc7ae72b3f482cf2d075a74c8c.png"></a>'
          );
          }
        };
        //Prevent info windows from being updated before Foursquare data loads
        setTimeout(addPlaceInfo,1000);
      };
    };
    getPlaceData();

    //the currently selected place
    this.currentPlace = ko.observable(this.placeList()[0].marker);

    //defines the interactions of the current place
    var interact = function(key) {
      //removes all animation on former "current place"
      self.currentPlace().setAnimation(null);
      //sets clicked place to current place
      self.currentPlace(key);
      //toggles animation and opens info window at current place
      toggleBounce(key);
      var contentString = key.placeInfo();
      infowindow.open(map,key);
      infowindow.setContent(contentString);
    }

    //add event listeners to markers
      for(var i=0; i < placeLength; i++) {
        google.maps.event.addListener(self.placeList()[i].marker, 'click', function(){
          interact(this);
          $(this).closest("#place-item").addClass('bold-title');
        })
      };

    //change the current place when list item is clicked
    this.setCurrentPlace = function(clickedPlace){
      interact(clickedPlace.marker);
    };

    function toggleBounce(marker) {
      if (marker.getAnimation() != null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
      }
    };

    //create an infowindow
    var infowindow = new google.maps.InfoWindow();

    self.query = ko.observable('');

    //Live-search filters placeItems by name
    self.search = ko.computed(function(){
      return ko.utils.arrayFilter(self.placeList(), function(place){
        if(place.marker.title.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
          place.marker.setMap(map);
        } else {
          place.marker.setMap(null);
        };
        return place.marker.title.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
      });
    });

    //find nearby places and add them to the venueList
    var venueList = [];

    var nearbyPlaces = function(){
      var foursquareUrl = 'https://api.foursquare.com/v2/venues/search?ll=41.825283, -71.4126816&query=restaurant&client_id=WGP24ZPE3M4UTYO3STK2KU0XTLA4V4C5R3GUHQL5DJRFCKIA&client_secret=A1SD3AFP1YDTU1ATMYV4BFVX1V421CFBQQXB1Y2XZXZ2LVPW&v=20150819';

      $.getJSON(foursquareUrl, function(data) {
        for(var i=0; i <20; i++) {
          var venues = data.response.venues[i];
          venueList.push(venues);
          }
        });
    };
    nearbyPlaces();

    //append nearby place data to the search modal
    //link places on the list to their foursquare pages
    var $nearby = $('#search-FS');
    setTimeout(function(){
      for(var i=0; i < 20; i++) {
        var venueName = venueList[i].name;
        var venueId = venueList[i].id;
        $nearby.append('<p><a href="https://foursquare.com/v/' +venueId+ '" target="_blank">' +venueName+ '</a></p>');
      }
    },1000);

    //API data from Weather Underground
    //Check the conditions before choosing which hotspot to visit!

    //URL for weather data for Providence, RI
    var wundergroundUrl = 'http://api.wunderground.com/api/ebf06033e08ca1b6/conditions/q/RI/Providence.json';
    var apiCallWunderground= $.get(wundergroundUrl);

    apiCallWunderground.done(function(data) {
        // success
        $('#conditions').append('<p>' +data.current_observation.weather+ '</p>');
        $('#temp').append('<p>' +data.current_observation.temp_f+ "° F" + '</p>');
        $('#mobile-temp').append('<p>' +data.current_observation.temp_f+ "° F" + '</p>');
    });
    apiCallWunderground.fail(function(xhr, err) {
        // failure
            console.log('Unable to retrieve weather data');
    });

//Info Window manipulation
//http://en.marnoto.com/2014/09/5-formas-de-personalizar-infowindow.html
    /*
     * The google.maps.event.addListener() event waits for
     * the creation of the infowindow HTML structure 'domready'
     * and before the opening of the infowindow defined styles
     * are applied.
     */
    google.maps.event.addListener(infowindow, 'domready', function() {

       // Reference to the DIV which receives the contents of the infowindow using jQuery
       var iwOuter = $('.gm-style-iw');

       /* The DIV we want to change is above the .gm-style-iw DIV.
        * So, we use jQuery and create a iwBackground variable,
        * and took advantage of the existing reference to .gm-style-iw for the previous DIV with .prev().
        */
       var iwBackground = iwOuter.prev();

       // Remove the background shadow DIV
       iwBackground.children(':nth-child(2)').css({'display' : 'none'});

       // Remove the white background DIV
       iwBackground.children(':nth-child(4)').css({'display' : 'none'});
    });
  };

  ko.applyBindings(new ViewModel());
});