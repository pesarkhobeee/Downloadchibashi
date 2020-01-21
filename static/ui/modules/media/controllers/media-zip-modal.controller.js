(function (undefined) {
    'use strict';

    angular
        .module('media')
        .controller('MediaZipController', [
            '$scope',
            '$uibModalInstance',
            'MediaImpl',
            function ($scope, $uibModalInstance, MediaImpl) {
                var impl = new MediaImpl($scope, $uibModalInstance);
                $scope.model = {};

                $scope.dismissModal = impl.dismissModal;
                //$scope.signUp = impl.signUp;
            }
        ]);
})();