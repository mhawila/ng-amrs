(function() {
  'use strict';

  angular
    .module('app.patientdashboard')
    .controller('EncounterCtrl', EncounterCtrl);

  EncounterCtrl.$inject = [
    '$stateParams',
    '$timeout',
    'EncounterResService',
    'EncounterModel',
    '$location',
    '$rootScope',
    '$modal'
  ];

  function EncounterCtrl($stateParams, $timeout, EncounterResService,
    EncounterModel, $location, $rootScope,$modal) {
    var vm = this;
    vm.encounterList = [];
    vm.selectedEncounter = null;
    vm.experiencedLoadingError = false;
    vm.isBusy = true;
    vm.hasEncounters = false;
    //Pagination Variables
    vm.currentPage = 1;
    vm.entryLimit = 10;
    vm.totalItems = 0;
    vm.noOfPages = 0;
    vm.setSelected = function(encounter) {
      vm.selectedEncounter = encounter;

    }

    vm.loadEncounterForm = function(EncounterModel) {
      $rootScope.activeEncounter = EncounterModel;
      $location.path('/encounter/' + EncounterModel.uuid() + '/patient/' +
        EncounterModel.patientUuid());
    }

    vm.showNoEncounters = function() {
      return !vm.isBusy && !vm.experiencedLoadingError && !vm.hasEncounters;
    }

    vm.EncounterDetails = function(encounterUuid) {
      console.log('Encounter Details');
      var modalInstance = $modal.open({
        animation: true,
        size:'lg',
        templateUrl: 'views/patient-dashboard/view-encounter-modal.html',
        controller: 'ViewEncounterCtrl',
        resolve: {
          items: function() {
            return encounterUuid;
          }
        }
      });
      modalInstance.result.then(function() {
        console.log();
      }, function() {

      });
    };

    $timeout(function() {
      var params = {
        patientUuid: $stateParams.uuid
      };
      vm.experiencedLoadingError = false;
      EncounterResService.getPatientEncounters(params, onLoadEncountersSuccess,
        onLoadEncountersError);
    }, 1000);

    function onLoadEncountersSuccess(data) {
      vm.isBusy = false;
      vm.encounterList = EncounterModel.toArrayOfModels(data);
      vm.hasEncounters = vm.encounterList.length > 0 ? true : false;
      vm.totalItems = vm.encounterList.length;
      vm.noOfPages = Math.ceil(vm.totalItems / vm.entryLimit);
      addLatestEncounterPerTypeToRootScope();
    }

    function onLoadEncountersError(error) {
      vm.isBusy = false;
      vm.experiencedLoadingError = true;
      console.error('Error: EncounterController An error' + error +
        'occured while loading');
    }
    
    function addLatestEncounterPerTypeToRootScope() {
        $rootScope.latestEncounterPerType = {};
        
        var latestEncounters = {};
        _.each(vm.encounterList, function(encounter){
            if(latestEncounters[encounter.encounterTypeUuid()] === undefined) {
                latestEncounters[encounter.encounterTypeUuid()] = encounter;
            }
        });
        $rootScope.latestEncounterPerType = latestEncounters;
    }
  }
})();
