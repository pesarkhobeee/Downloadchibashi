(function (undefined) {
    'use strict';

    angular
        .module('core')
        .controller('CoreSignUpController', [
            '$scope',
            '$uibModalInstance',
            'CoreImpl',
            function ($scope, $uibModalInstance, CoreImpl) {
                var impl = new CoreImpl($scope, $uibModalInstance);
                $scope.model = {};

                $scope.dismissModal = impl.dismissModal;
                $scope.signUp = impl.signUp;
                $scope.loginIt = impl.login;
                $scope.passRemeber = impl.passRemeber;
            }
        ]);
})();