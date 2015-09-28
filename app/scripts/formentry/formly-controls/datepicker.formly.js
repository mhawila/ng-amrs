/*
jshint -W106, -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
*/
(function () {

  'use strict';

  var mod =
    angular
      .module('app.formentry');

  mod.run(function (formlyConfig, $filter) {
    var attributes = [
      'date-disabled',
      'custom-class',
      'show-weeks',
      'starting-day',
      'init-date',
      'min-mode',
      'max-mode',
      'format-day',
      'format-month',
      'format-year',
      'format-day-header',
      'format-day-title',
      'format-month-title',
      'year-range',
      'shortcut-propagation',
      'datepicker-popup',
      'show-button-bar',
      'current-text',
      'clear-text',
      'close-text',
      'close-on-date-selection',
      'datepicker-append-to-body'
    ];

    var bindings = [
      'datepicker-mode',
      'min-date',
      'max-date'
    ];

    var ngModelAttrs = {};

    angular.forEach(attributes, function (attr) {
      ngModelAttrs[camelize(attr)] = { attribute: attr };
    });

    angular.forEach(bindings, function (binding) {
      ngModelAttrs[camelize(binding)] = { bound: binding };
    });

    formlyConfig.setType({
      name: 'datepicker',
      template: '<input class="form-control" ng-model="model[options.key]" ' +
                'is-open="to.isOpen" ng-click="open($event)"  ' +
                'datepicker-options="to.datepickerOptions" />',

      wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      controller: ['$scope', function ($scope) {        
        $scope.open = function ($event) {
          $event.preventDefault();
          $event.stopPropagation();
          console.log('controller does a good job!');
          $scope.opened = true;
          console.log($scope);
        };
      }],
      overwriteOk: true,
      defaultOptions: {
          parsers: [function parseDate(value) {
              console.info('Filter is: ', $filter);
              console.info('Parser is called .... with value ' + value);
              var ret = $filter('date')(value || new Date(), 'yyyy-MM-dd HH:mm:ss', '+0300');
              console.info('Parsed: ', ret);
              return ret;
          }],
          formatters: [function(value){
              console.info('Formatter called... with value ', value);
              var ret = $filter('date')(value,'dd-MMM-yyyy','+0300');
              console.info('Formatted: ', ret);
              return ret;
          }],  
        ngModelAttrs: ngModelAttrs,
        templateOptions: {
          addonLeft: {
            class: 'glyphicon glyphicon-calendar',
            onClick: function (options, scope) {
              options.templateOptions.isOpen = !options.templateOptions.isOpen;
              //console.warn('id is wrong : ' + scope.id);
              //console.info('isOpen = ' + scope.to.isOpen);
            }
          },
          onFocus: function ($viewValue, $modelValue, scope) {
            scope.to.isOpen = !scope.to.isOpen;
            $modelValue = $filter('date')($viewValue,'yyyy-MM-dd HH:mm:ss','+0300');
            console.log('View value: ', $viewValue, 'Model value: ', $modelValue);
          },
          datepickerOptions: {}
        }
      }
    });

    function camelize(string) {
      string = string.replace(/[\-_\s]+(.)?/g, function (match, chr) {
        return chr ? chr.toUpperCase() : '';
      });
      // Ensure 1st char is always lowercase
      return string.replace(/^([A-Z])/, function (match, chr) {
        return chr ? chr.toLowerCase() : '';
      });
    }
    
  });
})();
