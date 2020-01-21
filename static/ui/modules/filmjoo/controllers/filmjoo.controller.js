(function (undefined) {
    'use strict';

    angular
        .module('filmjoo')
        .controller('FilmjooController', [
            '$scope',
      	    '$http',
      	    '$state',
      	    'ngNotify',
      	    'Settings',
	    '$stateParams',
            function ($scope,$http,$state,ngNotify,Settings,$stateParams) {

		if($stateParams.movieid) {
		        $http.get("/filmjoo/get_movie/" + $stateParams.movieid)
		        .then(function (response) {
		                //console.log(response.data.object);
		                //ngNotify.set(response.data.object);
		                $scope.result = JSON.parse(response.data.object);
		        });
		}


    		$scope.getinfo = function(vid) {
    			$state.go('filmjoogetmovie', { 'movieid':vid });
    		};

            	$scope.searchit = function() {
                    $http.get("filmjoo/search/" + $scope.search)
                    .then(function (response) {
                            //console.log(response.data.object);
                            $scope.searchnames = JSON.parse(response.data.object);
                    });

               }

		$scope.searchSuggest =  function($item) {
			$state.go('filmjoo', { 'movieid':$item.data });
		}


		$scope.movies = {};
		$scope.searchwords = "";

		$scope.refreshMovies = function(movies) {
			if(movies.length !== 0 ) {
				  $scope.searchwords = movies;
				    return $http.get(
				      'filmjoo/search/'+movies
				    ).then(function(response) {
					//console.log(JSON.parse(response.data.object));
				      $scope.movies = JSON.parse(response.data.object)
				    });
			}
		}


		$scope.getclips = function(title) {
                      $state.go('stuff', { 'searchtitle':title });
                  };

                $scope.wronginformations = function(vid) {
                      	    $http.get("filmjoo/send_faulty/" + vid)
		            .then(function (response) {
		                    //$scope.searchnames = JSON.parse(response.data.object);
		                      ngNotify.set(response.data.object, 'success');
		            });
                  };

                $scope.morality = function(vid) {

		            $http.get("filmjoo/send_report/" + vid)
		            .then(function (response) {
		                    //$scope.searchnames = JSON.parse(response.data.object);
		                      ngNotify.set(response.data.object, 'warn');
		            });
                  };

		$scope.searchsubtitles = function(vid, title) {
			    $http.get("filmjoo/search_subtitle/" + vid + '/' + title )
		            .then(function (response) {
				    //console.log(response.data.object);
		                    //$scope.subtitles = JSON.parse(response.data.object);
				    if(response.data.object) {
					    $scope.subtitles = response.data.object;
				    } else {
					    ngNotify.set("متاسفانه زیرنویسی یافت نشد", 'error');
				    }
		            });
	    	}

            }
        ]);
})();
