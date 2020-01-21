(function (undefined) {
    'use strict';

    angular
        .module('stuff')
        .controller('StuffController', [
            '$scope',
            'StuffImpl',
      	    '$http',
      	    '$state',
      	    'ngNotify',
      	    'Settings',
	    '$stateParams',
            function ($scope, StuffImpl,$http,$state,ngNotify,Settings,$stateParams) {
	                var impl = new StuffImpl($scope);



			if($stateParams.searchtitle) {
				
                 			$http.get("media/youtubeSearch/" + $stateParams.searchtitle)
            				.then(function (response) {
            				        console.log(response.data.object);
            				        $scope.searchnames = JSON.parse(response.data.object);
            				});
			}


            		$scope.downloadit = function(vid) {
            			Settings.session.url = "http://www.youtube.com/watch?v=" + vid;
            			$state.go('media');
            		};

            		$scope.searchit = function() {
					/*
                  				$http.get("media/youtubeSearch/" + $scope.search)
            				.then(function (response) {
            				        console.log(response.data.object);
            				        $scope.searchnames = JSON.parse(response.data.object);
            				});
					*/
					$state.go('stuff', { 'searchtitle':$scope.search });
                }
            }
        ]);
})();
