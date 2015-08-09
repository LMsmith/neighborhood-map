$(document).ready(function(){
  "use strict"

  //Toggle the view of the menu open and closed
  $('#menu-btn').on('click', function(){
    $('#place-menu').animate({
          visibility: "toggle"
      });
      ($('#menu-btn').text() === "[+] Show") ? $('#menu-btn').text("[X] Hide") : $('#menu-btn').text("[+] Show");
  });
  //filter icon glows yellow on hover
  $('#filter').on('mouseover', function(){
    $('#filter').attr("src", "img/filter-hover.png");
  });

  //filter icon remove glow when mouse leaves
  $('#filter').on('mouseleave', function(){
    $('#filter').attr("src", "img/filter.png");
  });

  //Set map options for Google map
    var mapOptions = {
      center: new google.maps.LatLng(41.825283, -71.4126816),
      zoom: 15
    };
    //create map
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    //define map styles
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