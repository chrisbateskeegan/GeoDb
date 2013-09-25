'use strict';

/* Controllers */

function LocationListController($scope, $http) {
  $scope.locations=[];
  $scope.loaded=false;
  $scope.loadedClass='';

  //$scope.removeRef='';
  //$scope.removeIndex=-1;

  $scope.submittedAlertMessage=false;
  $scope.removedAlertMessage=false;
  $scope.putFailedAlertMessage=false;

  $scope.editing = null;
  $scope.editingClone = null;

  $scope.offset={
    showOptions: [10,25,50],
    show: 10,
    value: 0,
    decrement: function(){
      this.value = Math.max(0,this.value-this.show);
    },
    increment: function(){
      this.value = Math.min($scope.locations.length-this.show,this.value+this.show);
    }
  };

  $scope.remove = function(ref, index){
    //$scope.removeRef = ref;
    //$scope.removeIndex = $scope.offset.value+index;
    $scope.locations.splice($scope.offset.value+index,1);
    $scope.removedAlertMessage = true;
  }

  $scope.edit = function(location) {
    if ( $scope.editing != null ) {
      $scope.cancel($scope.editing);
    }
    setEditing(location);
  }

  $scope.submit = function(location) {
    var changed = false;
    if ( location.gridRef != $scope.editingClone.gridRef ||
	 location.location != $scope.editingClone.location ) {
      changed = true;
    }
    
    if ( changed ) {
      saveChanges(location);
    } else {
      setEditing(false);
    }
  }

  $scope.cancel = function() {
    if ( $scope.editing == null ) {
      return;
    }
    $scope.editing.gridRef = $scope.editingClone.gridRef;
    $scope.editing.location = $scope.editingClone.location;
    setEditing(false);
  }

  $scope.map = {
    show: false,
    location: null,
    popup: function(location) {
      this.location = location;
      this.show = true;
    }
  }

  var setEditing = function(location){
    if ( location != false ) {
      location.editMode = true;
      $scope.editing = location;
      $scope.editingClone = _.clone(location);
    } else {
      $scope.editing.editMode = false;
      $scope.editing = null;
      $scope.editingClone = null;
    }
  };

  var saveChanges = function(location) {
    $http.put('locations/'+location.ref,{
      gridRef: location.gridRef,
      location: location.location
    }).success(function(data){
      if ( data.error == true ) {
	$scope.putFailedAlertMessage = true;    
      } else {
	setEditing(false);
	$scope.submittedAlertMessage = true;
      }
    }).error(function(data){
      $scope.putFailedAlertMessage = true;    
    });
  }

  $http.get('/locations.json').
    success(function(data) {
      _.each(data,function(location){
	location.editMode=false;
      });
      $scope.locations = data;
      $scope.loaded = true;
      $scope.loadedClass = "badge-info";
    }).
    error(function(data) {
      $scope.locations = [];
      $scope.loaded = false;
      $scope.loadedClass = "badge-error";
    });
}

function LocationMapController($scope, $http) {
  $scope.locations=[];

  $http({method: 'GET', url: '/locations.json'}).
    success(function(data) {
      $scope.locations = data;
    }).
    error(function(data) {
      $scope.locations = [];
    });
}

function IndexController($scope) {
}
