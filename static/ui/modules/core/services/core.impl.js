(function (undefined) {
    'use strict';

    angular
        .module('core')
        .filter('trustAsHtml', ['$sce', function ($sce) {
            return function (text) {
            return $sce.trustAsHtml(text);
            };
         }])
        .factory('CoreImpl', [
            'User',
            '$interval',
            '$uibModal',
            'ngNotify',
            function (User, $interval, $uibModal, ngNotify) {
                return function ($scope, $uibModalInstance) {

                  var openResetModal = function () {
                      $uibModal
                          .open({
                              size: 'sm',
                              templateUrl: 'static/ui/modules/core/views/core-reset-modal.html',
                              controller: 'CoreResetController'
                          });
                  };

                    var openSignUpModal = function () {
                        $uibModal
                            .open({
                                size: 'sm',
                                templateUrl: 'static/ui/modules/core/views/core-sign-up-modal.html',
                                controller: 'CoreSignUpController'
                            });
                    };

                    var openAddFeedbackModal = function () {
                      $uibModal
                        .open({
                          templateUrl: 'static/ui/modules/user/views/user-add-feedback.html',
                          controller: 'UserAddFeedbackController'
                        })
                        .result.then(function (resp) {
                        if (resp.status == 'ok') {
                          //  $scope.feedbacks.push(resp.object);
                        }
                      });
                    };

                    var dismissModal = function () {
                        $uibModalInstance.dismiss();
                    };

                    var signUp = function () {
                        if($scope.model.password != $scope.model.confirmPassword) {
                            ngNotify.set('کلمه عبور با تکرار ان مطابقت ندارد', 'error');
                            return;
                        }

                        if($scope.model.email != $scope.model.confirmEmail) {
                            ngNotify.set('پست الکترونیکی با تکرار ان مطابقت ندارد', 'error');
                            return;
                        }

                        User.signUp($scope.model)
                            .then(function (resp) {
                                if (resp.status != 'ok') {
                                    ngNotify.set(resp.message, 'error');
                                    return;
                                }

                                //$uibModalInstance.close(resp);
                                ngNotify.set(resp.message);
                                setTimeout(function(){ login(); }, 3000);
                            }, function (err) {
                                console.log(err);
                                ngNotify.set(err);
                            });

                    };


                    var reset = function () {
                        if($scope.model.password != $scope.model.confirmPassword) {
                             ngNotify.set('کلمه عبور با تکرار ان مطابقت ندارد', 'error');
                            return;
                        }

                        User.reset($scope.model)
                            .then(function (resp) {
                                if (resp.status != 'ok') {
                                    ngNotify.set(resp.message, 'error');
                                    return;
                                }


                                ngNotify.set(resp.message);
                                $uibModalInstance.close(resp);
                            }, function (err) {
                                console.log(err);
                                ngNotify.set(err);
                            });

                    };


                    var login = function() {

                     User.login($scope.model).then(function (resp) {
                                if (resp.status != 'ok') {
                                    ngNotify.set(resp.message, 'error');
                                    return;
                                }

                                $uibModalInstance.close(resp);
                                ngNotify.set(resp.message);
                                window.location.assign('#/user');
                                location.reload();

                            }, function (err) {
                                ngNotify.set(err, 'error');
                                console.log(err);
                            });

                    };

                    var passRemeber = function(){
                      User.passRemeber($scope.model).then(function (resp) {
                                 if (resp.status != 'ok') {
                                     ngNotify.set(resp.message, 'error');
                                     return;
                                 }
                                 $uibModalInstance.close(resp);
                                 ngNotify.set(resp.message);
                             }, function (err) {
                                 ngNotify.set(err, 'error');
                                 console.log(err);
                             });
                    }


                    var openPurchaseModal = function () {
                     $uibModal
                       .open({
                         templateUrl: 'static/ui/modules/user/views/user-purchase.html',
                         controller: 'UserPurchaseController'
                       })
                       .result.then(function (resp) {
                            console.log(resp);
                     });
                    };



                    return {
                        openResetModal: openResetModal,
                        openSignUpModal: openSignUpModal,
                        openAddFeedbackModal: openAddFeedbackModal,
                        dismissModal: dismissModal,
                        signUp: signUp,
                        login: login,
                        reset:reset,
                        passRemeber:passRemeber,
                        openPurchaseModal:openPurchaseModal
                    }
                }
            }
        ]);
})();
