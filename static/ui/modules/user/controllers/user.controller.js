(function (undefined) {
    'use strict';

    angular
        .module('user')
        .controller('UserController', [
            '$scope',
            'UserImpl',
            'feedbacks',
            'uiGridConstants',
            'ngNotify',
            'Settings',
            function ($scope, UserImpl, feedbacks, uiGridConstants, ngNotify, Settings) {
             //http://78.46.149.230:8080/user/filesList

                var impl = new UserImpl($scope);
                $scope.model = {};

               $scope.refresh = function(){
                impl.getPagePremium();
                impl.getCredit();
               };


                $scope.feedbacks = impl.feedback();
                $scope.openSubscribeModal = impl.openSubscribeModal;
                $scope.getPagePremium = impl.getPagePremium;
                $scope.getPage = impl.getPage;
                $scope.getCredit = impl.getCredit;
                $scope.getPurchesList = impl.getPurchesList;

                $scope.refresh();

                if(Settings.session && Settings.session.userurl) {
                  impl.openSubscribeModal();
                }
                // $scope.openAddFeedbackModal = impl.openAddFeedbackModal;





            }
        ]);
})();
