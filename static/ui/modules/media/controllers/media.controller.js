(function (undefined) {
    'use strict';

    angular
        .module('media')
        .controller('MediaController', [
            '$scope',
            'MediaImpl',
            'Settings',
            'CoreImpl',
            '$state',
            function ($scope, MediaImpl, Settings, CoreImpl, $state) {
                var impl = new MediaImpl($scope);
                var implCore = new CoreImpl($scope);
                $scope.model = {
                  url: Settings.session ? Settings.session.url : null
                };
                $scope.downloads = Settings.downloads ? Settings.downloads : [];
                
                $scope.getInfo = function() {
                    // REMEMBER: this section can redirect all download request to premium section
                    // if(Settings.session.username) {
                    //     Settings.session.userurl = $scope.model.url;
                    //     $scope.model.url = null; 
                    //     $state.go('user');
                    //     return;
                    // }
                    if ($scope.model.url.indexOf("youtube.") !=-1 && ($scope.model.url.indexOf("list=") !=-1  || $scope.model.url.indexOf("/channel/") !=-1  || $scope.model.url.indexOf("/user/") !=-1 )) {
                            Settings.session.feedbacktitle = 'توجه'
                            Settings.session.feedbackmessage = '<p>شما درخواست دانلود یک لیست و یا کانال ویدیویی را داده اید، دانلود اینگونه موارد در <b>بخش ویژه</b>امکان پذیر است، خواهشا نسبت به ثبت نام در این بخش اقدام بفرمایید</p>'
                            implCore.openAddFeedbackModal();      
                        return ;
                    } else {
                        impl.getInfo();
                    }
                }

		$scope.openHistoricSelectQualityModal = impl.openHistoricSelectQualityModal;

                if(Settings.session && Settings.session.url) {
                  impl.getInfo();
		          Settings.session.url = null; 
                }

                $scope.openZipModal = impl.openZipModal;

            }
        ]);
})();
