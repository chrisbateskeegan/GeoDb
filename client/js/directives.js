'use strict';

/* Directives */

var module = angular.module('geodb.directives',[]);

module.directive('alert', function() {
  var Alert = function(element, type) {
    var el = element;

    el.addClass('alert-'+type).addClass('fade in hide');

    var show = function(autohide) {
      el.alert().fadeIn(250);
      if ( autohide =='true' ) {
	_.delay(hide, 3250);
      }
    };

    var hide = function() {
      el.alert('close');
    };

    return {show: show, hide: hide};
  }

  var ddo = {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {
      show: '=show'
    },
    link: function(scope, element, attrs)
    {
      var a = new Alert(element, attrs.type);

      scope.$watch( 'show', function(newVal,oldVal) {
	console.log("show: %s", newVal);
	if ( newVal == true ) {
	  a.show(attrs.autohide);
	}

	if ( newVal == false && oldVal == true ) {
	  a.hide();
	}
      }, true );
    },
    templateUrl: 'partials/alert'
  }

  return ddo;
});

module.directive('mapModal', function() {
  var mapOptions = {
    center: new google.maps.LatLng(53.9689, -2.6278), // lancashire
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.HYBRID
  };
  var map = null;

  var Map = function(element) {
    var el = element;

    var show = function(lat, lon) {
      if ( map == null ) {
	map = new google.maps.Map(el, mapOptions);
      }

      var ll = new google.maps.LatLng(lat,lon);
      map.setCenter(ll);
      google.maps.event.trigger(map, 'resize');
    }

    var hide = function() {
      map = null;
    }

    return { show: show, hide: hide };
  }

  /*
  var map = {
    element: null,
    map: null,
    marker: null,
    locations: null,

    init: function(element) {
      if ( this.element != null ) {
	return;
      }
      
      this.element = element;
    },

    show: function(scope) {
      if ( this.element == null ) {
	return;
      }

      if ( this.map == null ) {
	this.map = new google.maps.Map(this.element, this.options);
	console.log(this.map.getDiv().valueOf());
      }

      var ll = new google.maps.LatLng(scope.lat,scope.lon);
      this.map.setCenter(ll);
      this.map.setZoom(15);

      if ( this.locations == null ) {
	var self = this;
	this.locations = scope.locations;
	_.each(this.locations, function(location) {
	    self.createMarker(location);
	});
      }
    },

    createMarker: function(location) {
      var marker = new google.maps.Marker({
        map: this.map
      });

      marker.setPosition(new google.maps.LatLng(location.lat, location.lon));
      marker.setTitle("Location #" + location.ref + " (" + location.gridRef + ")");
    }
  };
  */

  var Modal = function(element){
    var el = element;
    
    el.addClass("map_modal hide fade in");
    el.modal({background:true, show:false});

    var show = function() {
      el.modal('show');
    };

    var hide = function() {
      el.modal('hide');
    };

    var on = function(ev,cb) {
      if ( el == null ) {
	return;
      }
      el.on(ev,cb);
    }

    return {show:show, hide:hide, on: on};
  };

  var ddo = {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {
      locations: "=locations",
      description: "=desc",
      lat: "=lat",
      lon: "=lon",
      show: "=show",
    },
    link: function(scope, element, attrs)
    {
      var modalElement = element;
      var mapElement = $(element.find('.map_canvas')).get(0);
      
      var map = new Map(mapElement);
      var modal = new Modal(modalElement);

      modal.on('show', function(){
	map.show(scope.lat, scope.lon);
      });
      modal.on('hidden', function(){
	map.hide();
      });

      scope.$watch( 'show', function(newVal,oldVal) {
	if ( newVal == true ) {
	  modal.show();
	}

	if ( newVal == false && oldVal == true ) {
	  modal.hide();
	}
      }, true );
    },
    templateUrl: 'partials/location-map'
  }

  return ddo;
});
