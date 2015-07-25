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

  //initialize the Google map
  function initialize() {
    var mapOptions = {
      center: { lat: 41.825283, lng: -71.4126816},
      zoom: 16
    };

  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  };

  var places = [
    {
      position: { lat: 41.8278122, lng: -71.4002354},
      title: 'La Creperie',
      url: 'http://creperieprov.com/'
    },

    {
      position: { lat: 41.825475, lng: -71.413958},
      title: 'Union Station Brewery',
      url: 'https://www.johnharvards.com/locations/providence-ri/'
    },

    {
      position: { lat: 41.8211319, lng: -71.4119614},
      title: 'Providence Performing Arts Center',
      url: 'http://www.ppacri.org/'
    },

    {
      position: { lat: 41.826888, lng: -71.407726},
      title: 'RISD Museum',
      url: 'http://risdmuseum.org/'
    },

    {
      position: { lat: 41.8551243, lng: -71.3616245},
      title: 'Hope Street Farmers Market',
      url: 'http://hopestreetmarket.com/'
    },

    {
      position: { lat: 41.8186278, lng: -71.4262943},
      title: 'The Avery',
      url: 'http://averyprovidence.com/'
    },

    {
      position: { lat: 41.8175712, lng: -71.4225758},
      title: 'Classic Cafe',
      url: 'http://classiccaferi.com/'
    },

    {
      position: { lat: 41.8231192, lng: -71.4054752},
      title: 'Cable Car Cinema',
      url: 'http://www.cablecarcinema.com/'
    },

    {
      position: { lat: 41.8274751, lng: -71.4138953},
      title: 'WaterFire',
      url: 'http://waterfire.org/'
    },

    {
      position: { lat: 41.7862761, lng: -71.3933733},
      title: 'Culinary Arts Museum',
      url: 'http://www.jwu.edu/content.aspx?id=40194'
    },

  ];

  //Define the Place class with ko observables
  var Place = function(data){
    this.position = ko.observable(data.position);
    this.title = ko.observable(data.title);
    this.url = ko.observable(data.url);
  };

  //---Start VIEWMODEL-------------
  var ViewModel = function(){
    var self = this;

    //Store place items in an observable array
    this.placeList = ko.observableArray([]);

    places.forEach(function(placeItem){
    self.placeList().push(new Place(placeItem));
  });
  };
  google.maps.event.addDomListener(window, 'load', initialize);
  ko.applyBindings(new ViewModel());
});
