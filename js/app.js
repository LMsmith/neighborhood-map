var map;
function initMap() {
  //Set map options for Google map
  var mapOptions = {
    center: new google.maps.LatLng(41.825283, -71.4126816),
    zoom: 15
  };
  //create map
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

$(document).ready(function(){
  "use strict"

  //filter icon glows yellow on hover
  $('#filter').on('mouseover', function(){
    $('#filter').attr("src", "img/filter-hover.png");
  });

  //filter icon remove glow when mouse leaves
  $('#filter').on('mouseleave', function(){
    $('#filter').attr("src", "img/filter.png");
  });
initMap();

    //--------------------------------------Start MODEL----------------------------------------------------
    var Model = function(data){

        //Set attributes for places
        this.title = ko.observable(data.title);
        this.category = ko.observable(data.category);
        this.newMarker = function(){
          this.marker = new google.maps.Marker({
          position: new google.maps.LatLng(data.lat, data.lng),
          icon: data.markerIcon,
          title: data.title,
          placeInfo : ko.observable(data.placeInfo),
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

    this.clearMarkers = function(){
      for(var i=0; i < placeLength; i++){
        self.placeList()[i].marker.setMap(null);
      };
    }

    //get data from Foursquare about places on the map
    this.getFoursquareData = function() {
      for(var i=0; i < placeLength; i++){
        //define latitude-longitude variable for each place
        var placeLL =  self.placeList()[i].marker.position.G + ',' + self.placeList()[i].marker.position.K;
        var foursquareUrl='https://api.foursquare.com/v2/venues/search?ll=' +placeLL+ '&client_id=WGP24ZPE3M4UTYO3STK2KU0XTLA4V4C5R3GUHQL5DJRFCKIA&client_secret=A1SD3AFP1YDTU1ATMYV4BFVX1V421CFBQQXB1Y2XZXZ2LVPW&v=20150819';

        var apiCallFoursquare= $.get(foursquareUrl);

        apiCallFoursquare.done(function(data) {
            // success
            this.name = data.response.venues[0].name;
            console.log(this);
            var phone = data.response.venues[0].contact.formattedPhone;
            var icon = data.response.venues[0].categories[0].icon.prefix + data.response.venues[0].categories[0].icon.suffix;
            if(data.response.venues[0].hasMenu) {
              var menu = data.response.venues[0].menu.anchor;
          };
            //console.log(self.placeList());
            //self.placeList().placeInfo(name);
        });
        apiCallFoursquare.fail(function(xhr, err) {
            // failure
                console.log('Unable to retrieve Foursquare data for this place');
        });
        self.placeList()[i].marker.placeInfo('<h1>' + '</h1>');
      };
      console.log(apiCallFoursquare.name);
    }

    this.getFoursquareData();
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

    self.search = ko.computed(function(){
      return ko.utils.arrayFilter(self.placeList(), function(place){
        return place.marker.title.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
      });
    });

    $('#filter-btn').on('click', function(){
      //open modal with filter options
    });

  };

  ko.applyBindings(new ViewModel());
});