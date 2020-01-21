(function (undefined) {
    'use strict';

    angular
        .module('user')
        .controller('UserPurchaseController', [
            '$scope',
            '$uibModalInstance',
            'UserImpl',
            function ($scope, $uibModalInstance, UserImpl) {
                var impl = new UserImpl($scope, $uibModalInstance);

                $scope.model = {};
                $scope.purchase = impl.purchase;
                $scope.dismissModal = impl.dismissModal;
                $scope.addFeedback = impl.addFeedback;
            }
        ]);
})();
