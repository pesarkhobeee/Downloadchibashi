(function (undefined) {
    'use strict';

    angular
        .module('user')
        .config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
            function ($urlRouterProvider, $stateProvider, $locationProvider) {

                /*$urlRouterProvider.otherwise(function ($injector) {
                 $injector.get('$state').transitionTo('root', null, {location: false});
                 });*/
                $urlRouterProvider.otherwise('/');

                $stateProvider
                    .state('user', {
                        url: '/user',
                        templateUrl: 'static/ui/modules/user/views/user-index.html',
                        controller: 'UserController',
                        resolve: {
                            feedbacks: [function () {
                                //this function must return feedback list
                                return []; //temporarily
                            }]
                        }
                    })
                ;
            }
        ]);
})();
