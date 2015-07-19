"use strict"

//View

function initialize() {
  var mapOptions = {
    center: { lat: 41.825283, lng: -71.4126816},
    zoom: 16
  };

var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
var marker = new google.maps.Marker({
  position: { lat: 41.8278122, lng: -71.4002354},
  map: map,
  title: 'La Creperie'
  });
}
google.maps.event.addDomListener(window, 'load', initialize);

var Place = function(data){
  this.position = ko.observable(data.position);
  this.title = ko.observable(data.title);
  this.url = ko.observable(data.url);
};

//ViewModel


var ViewModel = function(){
  var self = this;

  this.placeList = ko.observableArray([]);

    places.forEach(function(placeItem){
    self.placeList.push(new Place(placeItem));
  });
  console.log(this.placeList);
  this.currentPlace = ko.observable(this.placeList()[0]);

  this.setPlace = function(clickedPlace) {
    self.currentPlace(clickedPlace);
  }
}

ko.applyBindings(new ViewModel());
