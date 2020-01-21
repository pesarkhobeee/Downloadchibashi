(function (undefined) {
    'use strict';

    angular
        .module('user')
        .controller('UserAddFeedbackController', [
            '$scope',
            '$uibModalInstance',
            'UserImpl',
            'Settings',
            function ($scope, $uibModalInstance, UserImpl, Settings) {
                var impl = new UserImpl($scope, $uibModalInstance);

                $scope.model = {};

                if(Settings.session && Settings.session.feedbacktitle) {
                  $scope.feedbacktitle = Settings.session.feedbacktitle;
		          Settings.session.feedbacktitle = null; 
                  $scope.feedbackmessage = Settings.session.feedbackmessage;
		          Settings.session.feedbackmessage = null; 
                }

                $scope.dismissModal = impl.dismissModal;
                $scope.addFeedback = impl.addFeedback;
            }
        ]);
})();