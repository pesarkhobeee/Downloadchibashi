(function (undefined) {
    'use strict';

    angular
        .module('stuff')
        .config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
            function ($urlRouterProvider, $stateProvider, $locationProvider) {

                /*$urlRouterProvider.otherwise(function ($injector) {
                 $injector.get('$state').transitionTo('root', null, {location: false});
                 });*/
                $urlRouterProvider.otherwise('/');

                $stateProvider
			.state('stuff', {
			    url: '/stuff/:searchtitle',
      	                templateUrl: 'static/ui/modules/stuff/views/stuff-index.html',
	                controller: 'StuffController',
			})
                ;
            }
        ]);
})();
