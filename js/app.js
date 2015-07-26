$(document).ready(function(){
  "use strict"

  //---Start MODEL-------------
  //Toggle the view of the menu open and closed
  $('#menu-btn').on('click', function(){
    $('#place-menu').animate({
          width: "toggle"
      });
  $('ul li').toggle();
  });

  var places = [
    {
      lat: 41.8278122,
      lng:  -71.4002354,
      title: 'La Creperie',
      url: 'http://creperieprov.com/',
      placeInfo: ''
    },

    {
      lat: 41.825475,
      lng: -71.413958,
      title: 'Union Station Brewery',
      url: 'https://www.johnharvards.com/locations/providence-ri/',
      placeInfo: ''
    },

    {
      lat: 41.8211319,
      lng: -71.4119614,
      title: 'Providence Performing Arts Center',
      url: 'http://www.ppacri.org/',
      placeInfo: ''
    },

    {
      lat: 41.826888,
      lng: -71.407726,
      title: 'RISD Museum',
      url: 'http://risdmuseum.org/',
      placeInfo: ''
    },

    {
      lat: 41.8551243,
      lng: -71.3616245,
      title: 'Hope Street Farmers Market',
      url: 'http://hopestreetmarket.com/',
      placeInfo: ''
    },

    {
      lat: 41.8186278,
      lng: -71.4262943,
      title: 'The Avery',
      url: 'http://averyprovidence.com/',
      placeInfo: ''
    },

    {
      lat: 41.8175712,
      lng: -71.4225758,
      title: 'Classic Cafe',
      url: 'http://classiccaferi.com/',
      placeInfo: ''
    },

    {
      lat: 41.8231192,
      lng: -71.4054752,
      title: 'Cable Car Cinema',
      url: 'http://www.cablecarcinema.com/',
      placeInfo: ''
    },

    {
      lat: 41.8274751,
      lng: -71.4138953,
      title: 'WaterFire',
      url: 'http://waterfire.org/',
      placeInfo: ''
    }

  ];

  //Define the Model class with ko observables
  var Model = function(data){

    //Set map options for Google map
      var mapOptions = {
        center: { lat: 41.825283, lng: -71.4126816},
        zoom: 15
      };
    //Create new Google map
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    //Set attributes for places
    this.title = ko.observable(data.title);
    this.url = ko.observable(data.url);
    this.placeInfo = ko.observable(data.placeInfo)
    this.marker = new google.maps.Marker({
    position: new google.maps.LatLng(data.lat, data.lng),
    title: data.title,
    url: data.url,
    infowindow: data.placeInfo,
    animation: google.maps.Animation.DROP
  });
  //Add markers to the map
    this.addMarker =function() {
    this.marker.setMap(map);
  };

  google.maps.event.addDomListener(window, 'load');
  };

  //---Start VIEWMODEL-------------
  var ViewModel = function(){
    var self = this;

    //Create observable array this.placeList
    this.placeList = ko.observableArray([]);

    //Add places to placeList
    places.forEach(function(placeItem){
    self.placeList().push(new Model(placeItem));
  });

  var placeLength = this.placeList().length;

  //Iterate through the placeList and add markers to the map
  this.setMarkers = function(){
    for (var i = 0; i < placeLength; i++) {
      self.placeList()[i].addMarker();
      console.dir(self.placeList()[i]);
    }
  };
  this.setMarkers();

  };
  ko.applyBindings(new ViewModel());
});
