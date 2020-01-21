(function(undefined){
  'use strict';

  angular.module('core')
  .factory('Settings', ['$rootScope', '$window',function($rootScope, $window) {
    var settings = {};
    settings.session = $rootScope.session = $window.session;
    return settings;
  }]);
})();
