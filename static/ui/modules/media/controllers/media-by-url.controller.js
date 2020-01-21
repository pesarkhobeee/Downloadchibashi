(function (undefined) {
    'use strict';

    angular
        .module('media')
        .controller('MediaByUrlController', [
            '$scope',
            '$state',
            'MediaImpl',
            function ($scope, $state, MediaImpl) {
                var impl = new MediaImpl($scope);
                $scope.model = {
                    url: $state.params.url
                };
                $scope.downloads = [];
                $scope.getInfo = impl.getInfo;

                // get url info on init
                impl.getInfo();
            }
        ]);
})();