(function (undefined) {
    'use strict';

    angular
        .module('core')
        .controller('CoreResetController', [
            '$scope',
            '$uibModalInstance',
            'CoreImpl',
            function ($scope, $uibModalInstance, CoreImpl) {
                var impl = new CoreImpl($scope, $uibModalInstance);
                $scope.model = {};

                $scope.dismissModal = impl.dismissModal;
                $scope.reset = impl.reset;

            }
        ]);
})();
