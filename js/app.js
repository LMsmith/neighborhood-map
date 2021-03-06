/**
*Neighborhood Map Project - Providence, RI
*Created using the Google Maps API
*Location data from Foursquare
*Weather data from Weather Underground
*
*To run the program,
*clone the Github repository to your machine,
*open the dist folder
*and run index.html in the browser of your choice
*
*This app allows you to:
*Select a location to view contact information and link to its website
*Browse for other nearby locations using the "Browse Nearby!" button
*Filter hotspots by typing in the search bar
*Shift+s is a shortkey to focus on the search bar
*
*/

var map;
function initMap() {
  /**mapOptions - Set map options for Google map */
  "use strict";
  var mapOptions = {
    center: new google.maps.LatLng(41.825200, -71.4159719),
    zoom: 15
  };
  /**create map using defined mapOptions*/
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

$(document).ready(function(){
  "use strict";

initMap();

/**Browse icon highlight on mouseover */
$('#searchFS-btn').on('mouseover', function(){
  $('#searchFS-btn').attr("src", "img/browse-hover.png");
});

/**Remove highlight on mouseleave */
$('#searchFS-btn').on('mouseleave', function(){
  $('#searchFS-btn').attr("src", "img/browse.png");
});

//Off-canvas style slide menu based on tutorial from
//http://blog.tomri.ch/super-simple-off-canvas-menu-navigation/

$("#nav-btn").click(function(){
    $("#place-menu").toggleClass("active");
    $("#map-canvas").toggleClass("active");
    //http://stackoverflow.com/questions/22263266/jquery-toggle-text-to-change-on-click
    ($("#nav-btn").text() === "+") ? $("#nav-btn").text("X") : $("#nav-btn").text("+");
});

Mousetrap.bind('shift+s', function(e) {
  document.getElementById("search-box").focus();
});

    /**-------------------------------------Start MODEL--------------------------------------------------*/
    var Model = function(data){

        /**Set attributes for places */
        this.title = data.title;
        this.category = data.category;
        this.newMarker = function(){
          this.marker = new google.maps.Marker({
          position: new google.maps.LatLng(data.lat,data.lng),
          icon: data.markerIcon,
          title: data.title,
          placeInfo : data.placeInfo,
          map: map,
          url: data.url,
          animation: google.maps.Animation.DROP
        });
      };
    };

    /**-------------------------------------Start VIEWMODEL-------------------------------------------*/
    var ViewModel = function(){

      var self = this;

      /** self.placeList -  observable array of places */
      self.placeList = ko.observableArray([]);

      /**Add places to placeList */
      places.forEach(function(placeItem){
      self.placeList().push(new Model(placeItem));
    });

    /**placeLength is the length of observable array self.placeList() */
    var placeLength = self.placeList().length;

    /**Create markers for all places */
    self.allMarkers = function() {
      for(var i=0; i < placeLength; i++){
        self.placeList()[i].newMarker();
      }
    };
    self.allMarkers();

    /**infoPlaces holds  the data from Foursquare */
    var infoPlaces = [];

    for(var i=0; i < placeLength; i++){
      self.placeList()[i].marker.placeInfo = ko.observable('');
    }

    /**Get data from Foursquare about places on the map */
    var getPlaceData = function(){
      for(var i=0; i < placeLength; i++){
        /** placeLL - Define latitude-longitude variable for each place */
        var placeLL =  self.placeList()[i].marker.position.toString().replace(/\s+/g, '').replace('(', '').replace(')', '');
        console.log(placeLL);
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
        .fail(function() { alert('Failed to load Foursquare data!'); });

        /** Sort places alphabetically
        *http://stackoverflow.com/questions/6712034/sort-array-by-firstname-alphabetically-in-javascript
        */
        function addPlaceInfo(){
          infoPlaces.sort(function(a, b){
            if(a.name < b.name) return -1;
            if(a.name > b.name) return 1;
            return 0;
        });

        console.log(infoPlaces);
        //Add API data from Foursquare to the info windows
          for(var i=0; i < placeLength; i++) {
            self.placeList()[i].marker.placeInfo('<h2 id="iw-title">' +infoPlaces[i].name+ '</h2>' +
            '<p>Phone: ' +infoPlaces[i].phone+ '</p>' +
            '<a href="' +infoPlaces[i].url+ '" target="_blank">website</a>' +
            '<a href="https://foursquare.com/v/' +infoPlaces[i].id+ '" target="_blank"><img src="https://ss0.4sqi.net/img/poweredByFoursquare/poweredby-one-color-cdf070cc7ae72b3f482cf2d075a74c8c.png"></a>'
            );
          }
        }
        //setTimeout - Prevent info windows from being updated before Foursquare data loads
        setTimeout(addPlaceInfo,1000);
      }
    };
    getPlaceData();

    /**self.CurrentPlace - Define the currently selected place */
    self.currentPlace = ko.observable(this.placeList()[0].marker);

    /** interact - Defines the interactions of the current place */
    var interact = function(key) {
      /**Remove all animation on former "current place" */
      self.currentPlace().setAnimation(null);
      /**Set clicked place to current place */
      self.currentPlace(key);
      /**Toggle animation and opens info window at current place */
      toggleBounce(key);
      /**Define infowindow content and open an infowindow at the current marker */
      var contentString = key.placeInfo();
      infowindow.open(map,key);
      infowindow.setContent(contentString);
    };

    /**Add event listeners to markers */
      for(var j=0; j < placeLength; j++) {
        google.maps.event.addListener(self.placeList()[j].marker, 'click', function(){
          interact(this);
        });
      }

    /**Change the current place when list item is clicked */
    self.setCurrentPlace = function(clickedPlace){
      interact(clickedPlace.marker);
    };

    function toggleBounce(marker) {
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
      }
    }

    /**Create an infowindow */
    var infowindow = new google.maps.InfoWindow();

    /**self.query - required for live search */
    self.query = ko.observable('');

    //Live-search filters placeItems by name
    self.search = ko.computed(function(){
      return ko.utils.arrayFilter(self.placeList(), function(place){
        if(place.marker.title.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
          place.marker.setMap(map);
        } else {
          place.marker.setMap(null);
        }
        return place.marker.title.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
      });
    });

    /**------------------------NEARBY PLACES!------------------------
    *Find nearby places and add them to the venueList
    */
    var venueList = [];

    var nearbyPlaces = function(){
      var foursquareUrl = 'https://api.foursquare.com/v2/venues/search?ll=41.825283, -71.4126816&query=restaurant&client_id=WGP24ZPE3M4UTYO3STK2KU0XTLA4V4C5R3GUHQL5DJRFCKIA&client_secret=A1SD3AFP1YDTU1ATMYV4BFVX1V421CFBQQXB1Y2XZXZ2LVPW&v=20150819';

      $.getJSON(foursquareUrl, function(data) {
        for(var i=0; i <20; i++) {
          var venues = data.response.venues[i];
          venueList.push(venues);
          }
        })
        .fail(function() { alert('Failed to load Foursquare data! '); });
    };
    nearbyPlaces();

    /**Append nearby place data to the search modal
    *Link places on the list to their Foursquare pages
    */
    var $nearby = $('#search-FS');
    setTimeout(function(){
      for(var i=0; i < 20; i++) {
        var venueName = venueList[i].name;
        var venueId = venueList[i].id;
        $nearby.append('<p><a href="https://foursquare.com/v/' +venueId+ '" target="_blank">' +venueName+ '</a></p>');
      }
    },1000);

    /**API data from Weather Underground
    *Check the conditions before choosing which hotspot to visit!
    *
    *URL for weather data for Providence, RI
    */
    var wundergroundUrl = 'http://api.wunderground.com/api/ebf06033e08ca1b6/conditions/q/RI/Providence.json';
    var apiCallWunderground= $.get(wundergroundUrl);

    apiCallWunderground.done(function(data) {
        // success
        $('#conditions').append('<p>' +data.current_observation.weather+ '</p>');
        $('#mobile-conditions').append('<p>' +data.current_observation.weather+ '</p>');
        $('#temp').append('<p>' +data.current_observation.temp_f+ "° F" + '</p>');
        $('#mobile-temp').append('<p>' +data.current_observation.temp_f+ "° F" + '</p>');
    });
    apiCallWunderground.fail(function(xhr, err) {
        // failure
        console.log('Unable to retrieve weather data');
    });

      /**Info Window manipulation
      *http://en.marnoto.com/2014/09/5-formas-de-personalizar-infowindow.html
      *
     * The google.maps.event.addListener() event waits for
     * the creation of the infowindow HTML structure 'domready'
     * and before the opening of the infowindow defined styles
     * are applied.
     */
    google.maps.event.addListener(infowindow, 'domready', function() {

       //Reference to the DIV which receives the contents of the infowindow using jQuery
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

       var iwCloseBtn = iwOuter.next();
       iwCloseBtn.css({right: '38px', top: '12px'});
    });
  };
  /**Apply KO bindings */
  ko.applyBindings(new ViewModel());
});