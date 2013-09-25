'use strict';

/* Filters */

angular.module('geodb.filters',[]).
  filter('dataLoaded', function() {
    return function(loaded) {
      return loaded ? 'loadedClass' : '';
    }
  }).
  filter('slice', function() {
    return function(array, begin) {
      return array.slice(begin);
    }
  });