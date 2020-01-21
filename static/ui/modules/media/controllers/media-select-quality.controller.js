(function (undefined) {
    'use strict';

    angular
        .module('media')
        .controller('MediaSelectQualityController', [
            '$scope',
            '$uibModalInstance',
            'info',
            'model',
            'MediaImpl',
            function ($scope, $uibModalInstance, info, model, MediaImpl) {
                var impl = new MediaImpl($scope, $uibModalInstance);

                $scope.model = model;
                $scope.info = info;

                angular.forEach(info.quality, function(value, key) {
                  if(value.toLowerCase().indexOf('best') >= 0) {
                    $scope.model.quality = key;
                    return;
                  }
                });

                $scope.dismissModal = impl.dismissModal;
                $scope.download = impl.download;
            }
        ]);
})();
