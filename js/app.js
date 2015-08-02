$(document).ready(function(){
  "use strict"

  //Toggle the view of the menu open and closed
  $('#menu-btn').on('click', function(){
    $('#place-menu').animate({
          visibility: "toggle"
      });
  });
  //search icon glows yellow on hover
  $('#magnifying').on('mouseover', function(){
    $('#magnifying').attr("src", "img/search-hover.png");
  });

  //search icon remove glow when mouse leaves
  $('#magnifying').on('mouseleave', function(){
    $('#magnifying').attr("src", "img/search.png");
  });

  //Set map options for Google map
    var mapOptions = {
      center: new google.maps.LatLng(41.825283, -71.4126816),
      zoom: 15
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

   var styles = [
      {
        stylers: [
          { hue: "#314B69" },
          { saturation: -20 },
          {lightness: -5}
        ]
      },{
        featureType: "road",
        elementType: "geometry",
        stylers: [
          { hue: "#DBE852" },
          { saturation: -50 },
          { lightness: 40 },
          { visibility: "simplified" }
        ]
      },{
        featureType: "road",
        elementType: "labels",
        stylers: [
          { visibility: "off" }
        ]
      }
      ];
    map.setOptions({styles: styles});

    //--------------------------------------Start MODEL----------------------------------------------------
    var Model = function(data){

        //Set attributes for places
        this.title = ko.observable(data.title);
        this.url = ko.observable(data.url);
        this.placeInfo = ko.observable(data.placeInfo);
        this.newMarker = function(){
          this.marker = new google.maps.Marker({
          position: new google.maps.LatLng(data.lat, data.lng),
          icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
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
    var allMarkers = function() {
      for(var i=0; i < placeLength; i++){
        self.placeList()[i].newMarker();
      };
    };
    allMarkers();

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

  };
  ko.applyBindings(new ViewModel());
});