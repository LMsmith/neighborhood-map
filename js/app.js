$(document).ready(function(){
  "use strict"

  //Toggle the view of the menu open and closed
  $('#menu-btn').on('click', function(){
    $('#place-menu').animate({
          height: "toggle"
      });
  $('ul li').toggle();
  });

  //Set map options for Google map
    var mapOptions = {
      center: new google.maps.LatLng(41.825283, -71.4126816),
      zoom: 14
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

         var styles = [
            {
              stylers: [
                { hue: "#0080FF" },
                { saturation: -30 }
              ]
            },{
              featureType: "road",
              elementType: "geometry",
              stylers: [
                { lightness: 30 },
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


  //Define the Model class with ko observables
  var Model = function(data){

      //Set attributes for places
      this.title = ko.observable(data.title);
      this.url = ko.observable(data.url);
      this.placeInfo = ko.observable(data.placeInfo);
      this.newMarker = function(){
        this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.lat, data.lng),
        title: data.title,
        map: map,
        url: data.url,
        infowindow: new google.maps.InfoWindow(data.placeInfo),
        animation: google.maps.Animation.DROP
      });
    };
  };
google.maps.event.addDomListener(window, 'load');
  //---Start VIEWMODEL-------------
    var ViewModel = function(){
      var self = this;

      //Create observable array this.placeList
      this.placeList = ko.observableArray([]);

      //Add places to placeList
      places.forEach(function(placeItem){
      self.placeList().push(new Model(placeItem));
    });

    var placeLength = self.placeList().length;
    var allMarkers = function() {
      for(var i=0; i < placeLength; i++){
        self.placeList()[i].newMarker();
      };
    };
    allMarkers();
  };
  ko.applyBindings(new ViewModel());
});

