(function (undefined) {
  'use strict';

  angular
    .module('media')
    .factory('MediaImpl', [
      'Media',
      '$interval',
      '$uibModal',
      'ngNotify',
      'Settings',
      'CoreImpl',
      function (Media, $interval, $uibModal, ngNotify, Settings, CoreImpl) {
        var infoList = {};
        return function ($scope, $uibModalInstance) {
          var implCore = new CoreImpl($scope);
          var openZipModal = function () {
            $uibModal
              .open({
                templateUrl: 'static/ui/modules/media/views/media-zip-modal.html',
                controller: 'MediaZipController',
                resolve: {
                  info: function () {
                    //return info;
                    return "Hi";
                  },
                  model: function () {
                    //return angular.copy(url ? {url: url} : $scope.model);
                    return $scope.model;
                  }
                }
              })
              .result.then(function (resp) {
              $scope.model = {};
            });
          };


          var openSelectQualityModal = function (info, url) {
            $uibModal
              .open({
                templateUrl: 'static/ui/modules/media/views/media-select-quality.html',
                controller: 'MediaSelectQualityController',
                resolve: {
                  info: function () {
                    return info;
                  },
                  model: function () {
                    return angular.copy(url ? {url: url} : $scope.model);
                  }
                }
              })
              .result.then(function (resp) {
              $scope.model = {};
              resp.object.title = infoList[resp.object.url]['title'];
              $scope.downloads.unshift(resp.object);
              Settings.downloads = $scope.downloads;
            });
          };

          var getInfo = function () {
            Media.getInfo($scope.model)
              .then(function (resp) {
                if (resp.status == 'ok') {
                  openSelectQualityModal(resp.object);
                  infoList[$scope.model.url] = resp.object;
                } else if ( resp.status == 'alert')  {
                  //ngNotify.set('متاسفانه امکان دانلود این ادرس هنوز وجود ندارد!', 'error');
                        Settings.session.feedbacktitle = 'توجه';
                        Settings.session.feedbackmessage = resp.message;
                        implCore.openAddFeedbackModal();
                  } else {
                       ngNotify.set(resp.message, 'error');
                  }
              }, function (err) {
                ngNotify.set('امکان برقراری ارتباط با سرور موجود نمی باشد', 'error');
              });
          };
          var openHistoricSelectQualityModal = function (url) {
            openSelectQualityModal(infoList[url], url);
          }

          var dismissModal = function () {
            $uibModalInstance.dismiss();
          };

          var handleProgress = function (name) {
            var interval = $interval(function () {
              Media.state(name)
                .then(function (resp) {
                  if (resp.status != 'ok') {
                    ngNotify.set('متاسفانه مشکلی در روند دانلود بوجود امده، لطفا با مدیر سیستم تماس حاصل بفرمایید', 'error');
                    $interval.cancel(interval);
                    interval = undefined;
                    $scope.progress = null;
                    return;
                  }

                  if (resp.object.percent == 100 && resp.object.name) {
                    $interval.cancel(interval);
                    interval = undefined;
                    $scope.progress = null;
                    $uibModalInstance.close(resp);
                    return;
                  }

                  if (resp.object.percent > 0)
                    $scope.progress = resp.object;
                });
            }, 7000)
          };

          var download = function () {
            $scope.progress = {percent: 1};
            Media.download($scope.model)
              .then(function (resp) {
                if (resp.status != 'ok') {
                  console.log(resp.message);
                  return;
                }

                handleProgress(resp.object.name);
              }, function (err) {
                console.log(err);
              });
          };

          return {
            openZipModal: openZipModal,
            getInfo: getInfo,
            dismissModal: dismissModal,
            openHistoricSelectQualityModal: openHistoricSelectQualityModal,
            download: download
          }
        }
      }
    ]);
})();
