(function (undefined) {
    'use strict';

    angular
        .module('core')
        .controller('UserSubscribeController', [
            '$scope',
            '$uibModalInstance',
            'UserImpl',
            'Upload',
            'ngNotify',
            'Settings',
            '$state',
            function ($scope, $uibModalInstance, CoreImpl, Upload, ngNotify, Settings, $state) {
                var impl = new CoreImpl($scope, $uibModalInstance);
                $scope.model = {};
                if ( Settings.session.userurl ) {
                    $scope.model.email = Settings.session.userurl;
                    Settings.session.userurl = null; 
                }
                // upload later on form submit or something similar
                 $scope.submit = function() {
                   if ($scope.form.file.$valid && $scope.file) {
                     $scope.upload($scope.file);
                   }
                 };

                 // upload on file select or drop
                 $scope.upload = function (file) {
                     Upload.upload({
                         url: 'user/newsletter',
                         data: {file: file}
                     }).then(function (resp) {
                         console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                         if (resp.data.status != 'ok') {
                             ngNotify.set(resp.data.message, 'error');
                             return;
                         }
                         ngNotify.set(resp.data.message);
                         $uibModalInstance.close();

                     }, function (resp) {
                         console.log('Error status: ' + resp.status);
                     }, function (evt) {
                         var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                         console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                     });
                 };


                $scope.dismissModal = impl.dismissModal;
                $scope.subscribe  = function() {
                    /*
                    if ($scope.model.email.indexOf("vimeo.") !=-1 || $scope.model.email.indexOf("soundcloud.") !=-1 || $scope.model.email.indexOf("facebook.") !=-1 || ($scope.model.email.indexOf("youtube.") !=-1 && !($scope.model.email.indexOf("list=") !=-1  || $scope.model.email.indexOf("/channel/") !=-1 ))) {
                        Settings.session.url = $scope.model.email;
                        $state.go('media');
                        impl.dismissModal();
                        return ;
                    } else {
                    */
                        impl.subscribe();
                    //}
                }
            }
        ]);
})();
