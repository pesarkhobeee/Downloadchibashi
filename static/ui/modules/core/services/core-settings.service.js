(function(undefined){
  'use strict';

  angular.module('core')
  .factory('Session', ['$rootScope', '$window',function($rootScope, $window) {
    $rootScope.session = $window.session;
    return $rootScope.session;
  }]);
})();
