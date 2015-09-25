/*
jshint -W003, -W026
*/
(function() {
    'use strict';

    angular
        .module('app.patientdashboard')
            .directive('currentVisit', directive);

    function directive() {
      return {
        restrict: 'E',
        scope: { patientUuid: "@" },
        templateUrl: 'views/patient-dashboard/current-visit.html',
        controller: currentVisitController
      }
    }

    currentVisitController.$inject = [
        '$scope',
        '$rootScope',
        'VisitResService',
        '$stateParams',
        'EncounterResService',
        'EncounterModel',
        '$filter',
        '$timeout'
    ];

    function currentVisitController($scope, $rootScope, vService, $stateParams,
                                    encService, encModel, $filter, $timeout) {
        $scope.newVisit = {};
        $scope.someEncountersCompleted = false;
        $scope.busy = true;
        $scope.visitTypesLoaded = false;
        $scope.completedEncounters = [];
        $scope.visitDate = getFormattedDate(new Date());
        $scope.hasCompletedForms = false;
        $scope.formsFilledStatus = [{
                name: "AMPATH Adult Return Encounter Form",
                shortName: 'form1',
                enounterType: '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f',
                filled: false
            }, {
                name: "AMPATH Pediatric Return Encounter Form",
                shortName: 'form2',
                encounterType: '8d5b3108-c2cc-11de-8d13-0010c6dffd0f',
                filled: false
            }, {
                name: "AMPATH PMTCT Postnatal Care Encounter Form",
                shortName: 'form3',
                encounterType: 'b1e9ed0f-5222-4d47-98f7-5678b8a21ebd',
                filled: false
            }
        ];

        function getFormattedDate(date, format) {
            if(angular.isUndefined(format)) {
                format = 'yyyy-MM-ddTHH:mm:ss';
            }
            if(typeof date === 'string') {
                date = new Date(date);
            }
            var month = date.getMonth() + 1;
            var day = date.getDate();
            day = day > 9 ? day : '0' + day;
            month = month > 9 ? month : '0' + month;
            return date.getFullYear() + '-' + month + '-' + day;
        }

        $timeout(function fetchCompletedEncounters() {
            //Get todays encounters
            var params = {
                patientUuid: $stateParams.uuid,
            };
            encService.getPatientEncounters(params, function(data) {
                var todayEncounters = [];
                if(typeof data === 'array' && data.length > 0) {
                    $scope.someEncountersCompleted = true;
                    _.each(data, function (encounter) {
                        if($scope.visitDate ===
                            getFormattedDate(encounter.encounterDatetime)) {
                                todayEncounters.push(encounter);
                            }
                    });
                }

                if(todayEncounters.length > 0) {
                    data = todayEncounters;
                    $scope.hasCompletedForms = true;
                    $scope.completedEncounters = encModel.toArrayOfModels(data);
                    _.each(data, function(encounter) {
                         _.some($scope.formsFilledStatus, function(form) {
                            if(form.encounterType === encounter.encounterType.uuid) {
                                form.filled = true;
                                return true;
                            }
                        });
                    });
                }
            });
        },500);

        $timeout(function checkIfVisitStarted() {
             var simpleVisitRep = 'custom:(uuid,patient:(uuid,uuid),' +
                     'visitType:(uuid,name),location:ref,startDatetime)';
             var params = {
                 patientUuid: $scope.patientUuid,
                 startDatetime: $scope.visitDate,
                 v: simpleVisitRep
             }
             var visits = [];
             vService.getPatientVisits(params, function(data) {
                 visits = data;
             }, function(error) {
                 console.log('Error: An error occured');
             });
             if(visits.length > 0) {
                 $scope.visitStarted = true;
             } else {
                 $scope.visitStarted = false;
             }
             $scope.busy = false;
         },1000);

         $timeout(function loadVisitTypes() {
             vService.getVisitTypes(function(data) {
                 $scope.visitTypes = data;
                 $scope.visitTypesLoaded = true;
             });
         },1000);

         $scope.startNewVisit = function() {
             $scope.visitStartDatetime = new Date();

             //Format date
             var startDatetime = $filter('date')($scope.visitStartDatetime,
                'yyyy-MM-dd HH:mm:ss', '+0300');
             //Create visit
             var newVisit = {
                 patient: $scope.patientUuid,
                 visitType: $scope.newVisit.visitType,
                 startDatetime: startDatetime
             };
             console.log(newVisit)

             vService.saveVisit(newVisit, function(data) {
                 console.log('See data if there...',data);
                 $scope.newVisit.uuid = data.uuid;
                 $scope.visitStarted = true;
             });
         };

         $scope.hasCompletedForms = function(patientUuid) {

         }

         $scope.loadEncounterForm = function(EncounterModel) {
           $rootScope.activeEncounter = EncounterModel;
           $location.path('/encounter/' + EncounterModel.uuid() + '/patient/' +
             EncounterModel.patientUuid());
         }
    }
})();
