(function (undefined) {
    'use strict';

    angular
        .module('core')
        .controller('CoreController', [
            '$scope',
            'CoreImpl',
            'Settings',
            'ngNotify',
            function ($scope, CoreImpl, Settings, ngNotify) {
                var impl = new CoreImpl($scope);


                 if(Settings.session && Settings.session.reset) {
                   impl.openResetModal();
                   Settings.session.reset = null;
                 }

                 if(Settings.session && Settings.session.status) {
                   ngNotify.set(Settings.session.message, Settings.session.status);
                   Settings.session.status = null;
                 }

                 if(Settings.session && Settings.session.feedbacktitle) {
                   impl.openAddFeedbackModal();
                 }

                $scope.openResetModal = impl.openResetModal;
                $scope.openSignUpModal = impl.openSignUpModal;
                $scope.openPurchaseModal = impl.openPurchaseModal;
                $scope.openAddFeedbackModal = impl.openAddFeedbackModal;
            }
        ]);
})();
