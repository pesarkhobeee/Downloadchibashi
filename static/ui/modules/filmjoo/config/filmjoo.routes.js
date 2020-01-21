(function (undefined) {
    'use strict';

    angular
        .module('filmjoo')
        .config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
            function ($urlRouterProvider, $stateProvider, $locationProvider) {

                /*$urlRouterProvider.otherwise(function ($injector) {
                 $injector.get('$state').transitionTo('root', null, {location: false});
                 });*/
                $urlRouterProvider.otherwise('/');

                $stateProvider
                .state('filmjoo', {
                    url: '/filmjoo/:movieid',
                    templateUrl: 'static/ui/modules/filmjoo/views/filmjoo-index.html',
                    controller: 'FilmjooController'
                })
                .state('filmjoogetmovie', {
                    url: '/filmjoo/getmovie/:movieid',
                    templateUrl: 'static/ui/modules/filmjoo/views/filmjoo-getmovie.html',
                    controller: 'FilmjooGetMovieController'
                })
                ;
            }
        ]);
})();
