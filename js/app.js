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
    this.currentPlace = ko.observable(this.placeList()[0]);

    //add event listeners to markers
      for(var i=0; i < placeLength; i++) {
        google.maps.event.addListener(self.placeList()[i].marker, 'click', function(){
          self.currentPlace(this);
          toggleBounce(this);
          var contentString = this.placeInfo();
          infowindow.open(map,this);
          infowindow.setContent(contentString);
          $(this).closest("#place-item").addClass('bold-title');
        })
      };

    //change the current place when list item is clicked
    this.setCurrentPlace = function(clickedPlace){
      //remove any marker animation from previous currentPlace
      self.currentPlace().marker.setAnimation(null);
      self.currentPlace(clickedPlace);
      //animate currentPlace marker and open its info window
      toggleBounce(self.currentPlace().marker);
      openInfoWindow();
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

    //open an an info window at the location of the currentPlace
    function openInfoWindow(){
      var marker = self.currentPlace().marker;
      var contentString = self.currentPlace().placeInfo();
      infowindow.setContent(contentString);
      infowindow.open(map,marker);
    }

  };
  ko.applyBindings(new ViewModel());
});