/* global angular */
/*
jshint -W003, -W026
*/
(function () {
    'use strict';

    angular
        .module('app.patientdashboard')
        .directive('vitals', vitals);

    function vitals() {
        return {
            restict: "E",
            scope: { patientUuid: "@" },
            controller: vitalsController,
            link:vitalsLink,
            templateUrl: "views/patient-dashboard/vitalsPane.html"
        };
    }

    vitalsController.$inject = ['$scope', 'EtlRestService', 'VitalModel'];

    function vitalsController($scope, EtlRestService, vitalModel) {
        $scope.injectedEtlRestService = EtlRestService;
        $scope.encounters = [];
        $scope.isBusy = false;
        $scope.nextStartIndex = 0;
        $scope.loadMoreVitals = loadMoreVitals;
        $scope.allDataLoaded = false;
        $scope.experiencedLoadingError = false;

        function loadMoreVitals() {
            if ($scope.isBusy === true) return;

            $scope.isBusy = true;
            $scope.experiencedLoadingError = false;

            if ($scope.patientUuid && $scope.patientUuid !== '')
                EtlRestService.getVitals($scope.patientUuid, $scope.nextStartIndex, 10, onFetchVitalsSuccess, onFetchVitalsFailed);
        }

        function onFetchVitalsSuccess(vitalsData) {
            $scope.nextStartIndex = +vitalsData.startIndex + vitalsData.size;
            for (var e in vitalsData.result) {
                $scope.encounters.push(new vitalModel.vital(vitalsData.result[e]));
            }
            if (vitalsData.size !== 0) {
                $scope.isBusy = false;
            }
            else
                $scope.allDataLoaded = true;
        }

        function onFetchVitalsFailed(error) {
            $scope.experiencedLoadingError = true;
            $scope.isBusy = false;
        }
    }

    function vitalsLink(scope, element, attrs, vm) {
        attrs.$observe('patientUuid', onPatientUuidChanged);

        function onPatientUuidChanged(newVal, oldVal) {
            if (newVal && newVal != "") {
                scope.isBusy = false;
                scope.allDataLoaded = false;
                scope.nextStartIndex = 0;
                scope.encounters = [];
                scope.loadMoreVitals();
            }
        }
    }

})();