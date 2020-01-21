(function (undefined) {
    'use strict';

    angular
        .module('filmjoo')
        .controller('FilmjooGetMovieController', [
            '$scope',
      	    '$http',
      	    '$state',
      	    'ngNotify',
      	    'Settings',
            '$stateParams',
            function ($scope,$http,$state,ngNotify,Settings,$stateParams) {

                $http.get("/filmjoo/get_movie/" + $stateParams.movieid)
                .then(function (response) {
                        //console.log(response.data.object);
                        //ngNotify.set(response.data.object);
                        $scope.result = JSON.parse(response.data.object);
                });


		$scope.getclips = function(title) {
                      $state.go('stuff', { 'searchtitle':title });
                  };

                $scope.wronginformations = function(vid) {
                      	    $http.get("filmjoo/send_faulty/" + vid)
		            .then(function (response) {
		                    //$scope.searchnames = JSON.parse(response.data.object);
		                      ngNotify.set(response.data.object);
		            });
                  };

                $scope.morality = function(vid) {

		            $http.get("filmjoo/send_report/" + vid)
		            .then(function (response) {
		                    //$scope.searchnames = JSON.parse(response.data.object);
		                      ngNotify.set(response.data.object);
		            });
                  };

		$scope.searchsubtitles = function(vid, title) {
			    $http.get("filmjoo/search_subtitle/" + vid + '/' + title )
		            .then(function (response) {
				    //console.log(response.data.object);
		                    //$scope.subtitles = JSON.parse(response.data.object);
				    $scope.subtitles = response.data.object;
		            });
	    	}

            }
        ]);
})();
