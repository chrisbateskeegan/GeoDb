'use strict';


// Declare app level module which depends on filters, and services

var module=angular.module('geodb', ['geodb.filters','geodb.directives','geodb.services']).
  config([
    '$routeProvider', function($routeProvider){
      $routeProvider.
	when('/', {
	  templateUrl: 'partials/index',
	  controller: IndexController
	}).
	when('/browse/map', {
	  templateUrl: 'partials/browse-map',
	  controller: LocationMapController
	}).
	when('/browse/list', {
	  templateUrl: 'partials/browse-list',
	  controller: LocationListController
	}).
	otherwise({redirectTo: '/'});
    }]);


module.value('ui.config',{});