(function(undefined){
    'use strict';

    angular
        .module('media')
        .config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
            function ($urlRouterProvider, $stateProvider, $locationProvider) {

                /*$urlRouterProvider.otherwise(function ($injector) {
                    $injector.get('$state').transitionTo('root', null, {location: false});
                });*/
                $urlRouterProvider.otherwise('/');

                $stateProvider
                    .state('media', {
                        url: '/',
                        templateUrl: '/static/ui/modules/media/views/media-index.html',
                        controller: 'MediaController'
                    })
                    // .state('byUrl', {
                    //     url: '/byUrl/:url',
                    //     templateUrl: 'static/ui/modules/media/views/media-index.html',
                    //     controller: 'MediaByUrlController'
                    // })
                ;
            }
        ]);
})();
