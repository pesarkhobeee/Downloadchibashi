(function(undefined){
    'use strict';

    angular.module('core', [
        'ui.bootstrap',
        'ui.router',
        'blockUI',
	    'ngNotify',
        'ngFileUpload',
        'ngSanitize',
    ]);
})();

(function(undefined){
    'use strict';

    angular.module('media', ['core']);
})();
(function(undefined){
    'use strict';

    angular.module('filmjoo', ['core','ui.select','ngSanitize']);
})();

(function(undefined){
    'use strict';

    angular.module('stuff', ['core']);
})();
(function(undefined){
    'use strict';

    angular.module('user', ['core','ui.grid', 'ui.grid.resizeColumns', 'ui.grid.pagination', 'ui.bootstrap']);
})();

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

(function(undefined){
  'use strict';

  angular.module('core')
  .factory('Session', ['$rootScope', '$window',function($rootScope, $window) {
    $rootScope.session = $window.session;
    return $rootScope.session;
  }]);
})();

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

(function(undefined){
  'use strict';

  angular.module('core')
  .factory('Settings', ['$rootScope', '$window',function($rootScope, $window) {
    var settings = {};
    settings.session = $rootScope.session = $window.session;
    return settings;
  }]);
})();

'use strict';

(function (undefined) {
    angular
        .module('core')
        .factory('UriManager', [
            '$q',
            '$http',
            function ($q, $http) {
                var baseUri = '';
                return function (module) {
                    var serialize = function () {
                        var uri = baseUri + module;
                        for (var i = 0; i < arguments.length; i++) {
                            uri += '/' + arguments[i];
                        }
                        return uri;
                    };

                    var devResolve = function (params) {
                        var url = serialize.apply(this, params.path);

                        switch (url) {
                            case 'media/info':
                                return angular.fromJson({
                                    "status": "ok",
                                    "object": {
                                        "multiple": false,
                                        "thumb_url": "https://i.ytimg.com/vi/MnFkC1VG8rs/hqdefault.jpg",
                                        "quality": {
                                            "17": "3gp - 176x144 (small)",
                                            "140": "m4a - audio only (DASH audio)",
                                            "141": "m4a - audio only (DASH audio)",
                                            "160": "mp4 - 192x144 (DASH video)",
                                            "36": "3gp - 320x240 (small)",
                                            "43": "webm - 640x360 (medium)",
                                            "133": "mp4 - 320x240 (DASH video)",
                                            "5": "flv - 400x240 (small)",
                                            "18": "mp4 - 640x360 (medium) (best)",
                                            "242": "webm - 320x240 (DASH video)",
                                            "278": "webm - 192x144 (DASH video)",
                                            "250": "webm - audio only (DASH audio)",
                                            "251": "webm - audio only (DASH audio)",
                                            "249": "webm - audio only (DASH audio)",
                                            "171": "webm - audio only (DASH audio)"
                                        },
                                        "title": "\u067e\u0633\u0631 \u0634\u062c\u0627\u0639 - \u0648\u06cc\u06a9\u06cc\u0648\u0632"
                                    }
                                });
                            case 'media/download':
                                return angular.fromJson({
                                    "status": "ok",
                                    "object": {
                                        "url": "https://www.youtube.com/watch?v=MnFkC1VG8rs",
                                        "name": "844bbc32-e87a-4c24-81cd-f7d1ff3905a3.txt"
                                    }
                                });
                            case 'media/state/844bbc32-e87a-4c24-81cd-f7d1ff3905a3.txt':
                                var percent = Math.ceil(Math.random() * 5) * 20;
                                return angular.fromJson({
                                    "status": "ok",
                                    "object": {
                                        "time": "00:00",
                                        "percent": percent,
                                        "name": "2015-12-16_05:03:57.zip",
                                        "size": "8.76MiB"
                                    }
                                });

                            case 'user/signUp':
                                return angular.fromJson({"status": "ok", "message": "your message save successfully"});
                            case 'user/feedback':
                                return angular.fromJson({"status": "ok", "message": "your message save successfully"});
                            case 'user/newsletter':
                                return angular.fromJson({"status": "ok", "message": "your message save successfully"});
                            case 'user/downloadsHistory':
                                var History = [
                                    {title:'test1',url:'http://test1.com',date:'2016', size:'55M'},
                                    {title:'test2',url:'http://test2.com',date:'2016', size:'55M'},
                                    {title:'test3',url:'http://test3.com',date:'2016', size:'55M'},
                                    {title:'test4',url:'http://test4.com',date:'2016', size:'55M'}
                                ];
                                return angular.fromJson({
                                    "status": "ok",
                                    "object": {
                                        "History": History
                                    }
                                });
                            
                        }
                    };


                    var resolve = function (params) {
                        var deferred = $q.defer();

                        //deferred.resolve(devResolve(params));

                        $http({
                            method: params.method,
                            url: serialize.apply(this, params.path),
                            data: params.data
                        }).then(function (resp) {
                            deferred.resolve(resp.data);
                        }, function (err) {
                            deferred.reject(err);
                        });

                        return deferred.promise;
                    };

                    return {
                        serialize: serialize,
                        resolve: resolve,
                        devResolve: devResolve
                    }
                }
            }
        ]
    );
})();

(function(undefined){
    'use strict';

    angular
        .module('media')
        .config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
            function ($urlRouterProvider, $stateProvider, $locationProvider) {

                /*$urlRouterProvider.otherwise(function ($injector) {
                    $injector.get('$state').transitionTo('root', null, {location: false});
                });*/
                $urlRouterProvider.otherwise('/');

                $stateProvider
                    .state('media', {
                        url: '/',
                        templateUrl: '/static/ui/modules/media/views/media-index.html',
                        controller: 'MediaController'
                    })
                    // .state('byUrl', {
                    //     url: '/byUrl/:url',
                    //     templateUrl: 'static/ui/modules/media/views/media-index.html',
                    //     controller: 'MediaByUrlController'
                    // })
                ;
            }
        ]);
})();

(function (undefined) {
    'use strict';

    angular
        .module('media')
        .controller('MediaByUrlController', [
            '$scope',
            '$state',
            'MediaImpl',
            function ($scope, $state, MediaImpl) {
                var impl = new MediaImpl($scope);
                $scope.model = {
                    url: $state.params.url
                };
                $scope.downloads = [];
                $scope.getInfo = impl.getInfo;

                // get url info on init
                impl.getInfo();
            }
        ]);
})();
(function (undefined) {
    'use strict';

    angular
        .module('media')
        .controller('MediaSelectQualityController', [
            '$scope',
            '$uibModalInstance',
            'info',
            'model',
            'MediaImpl',
            function ($scope, $uibModalInstance, info, model, MediaImpl) {
                var impl = new MediaImpl($scope, $uibModalInstance);

                $scope.model = model;
                $scope.info = info;

                angular.forEach(info.quality, function(value, key) {
                  if(value.toLowerCase().indexOf('best') >= 0) {
                    $scope.model.quality = key;
                    return;
                  }
                });

                $scope.dismissModal = impl.dismissModal;
                $scope.download = impl.download;
            }
        ]);
})();

(function (undefined) {
    'use strict';

    angular
        .module('media')
        .controller('MediaZipController', [
            '$scope',
            '$uibModalInstance',
            'MediaImpl',
            function ($scope, $uibModalInstance, MediaImpl) {
                var impl = new MediaImpl($scope, $uibModalInstance);
                $scope.model = {};

                $scope.dismissModal = impl.dismissModal;
                //$scope.signUp = impl.signUp;
            }
        ]);
})();
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

(function (undefined) {
    'use strict';

    angular
        .module('media')
        .factory('Media', [
            'UriManager',
            function (UriManager) {

                var uriManager = new UriManager('media');

                return {
                    getInfo: function (data) {
                        return uriManager.resolve({
                            method: 'POST',
                            path: ['info'],
                            data: data
                        });
                    },
                    download: function (data) {
                        return uriManager.resolve({
                            method: 'POST',
                            path: ['download'],
                            data: data
                        });
                    },
                    state: function (name) {
                        return uriManager.resolve({
                            method: 'GET',
                            path: ['state', name]
                        });
                    }

                }
            }
        ]);
})();
(function (undefined) {
    'use strict';

    angular
        .module('filmjoo')
        .config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
            function ($urlRouterProvider, $stateProvider, $locationProvider) {

                /*$urlRouterProvider.otherwise(function ($injector) {
                 $injector.get('$state').transitionTo('root', null, {location: false});
                 });*/
                $urlRouterProvider.otherwise('/');

                $stateProvider
                .state('filmjoo', {
                    url: '/filmjoo/:movieid',
                    templateUrl: 'static/ui/modules/filmjoo/views/filmjoo-index.html',
                    controller: 'FilmjooController'
                })
                .state('filmjoogetmovie', {
                    url: '/filmjoo/getmovie/:movieid',
                    templateUrl: 'static/ui/modules/filmjoo/views/filmjoo-getmovie.html',
                    controller: 'FilmjooGetMovieController'
                })
                ;
            }
        ]);
})();

(function (undefined) {
    'use strict';

    angular
        .module('filmjoo')
        .controller('FilmjooController', [
            '$scope',
      	    '$http',
      	    '$state',
      	    'ngNotify',
      	    'Settings',
	    '$stateParams',
            function ($scope,$http,$state,ngNotify,Settings,$stateParams) {

		if($stateParams.movieid) {
		        $http.get("/filmjoo/get_movie/" + $stateParams.movieid)
		        .then(function (response) {
		                //console.log(response.data.object);
		                //ngNotify.set(response.data.object);
		                $scope.result = JSON.parse(response.data.object);
		        });
		}


    		$scope.getinfo = function(vid) {
    			$state.go('filmjoogetmovie', { 'movieid':vid });
    		};

            	$scope.searchit = function() {
                    $http.get("filmjoo/search/" + $scope.search)
                    .then(function (response) {
                            //console.log(response.data.object);
                            $scope.searchnames = JSON.parse(response.data.object);
                    });

               }

		$scope.searchSuggest =  function($item) {
			$state.go('filmjoo', { 'movieid':$item.data });
		}


		$scope.movies = {};
		$scope.searchwords = "";

		$scope.refreshMovies = function(movies) {
			if(movies.length !== 0 ) {
				  $scope.searchwords = movies;
				    return $http.get(
				      'filmjoo/search/'+movies
				    ).then(function(response) {
					//console.log(JSON.parse(response.data.object));
				      $scope.movies = JSON.parse(response.data.object)
				    });
			}
		}


		$scope.getclips = function(title) {
                      $state.go('stuff', { 'searchtitle':title });
                  };

                $scope.wronginformations = function(vid) {
                      	    $http.get("filmjoo/send_faulty/" + vid)
		            .then(function (response) {
		                    //$scope.searchnames = JSON.parse(response.data.object);
		                      ngNotify.set(response.data.object, 'success');
		            });
                  };

                $scope.morality = function(vid) {

		            $http.get("filmjoo/send_report/" + vid)
		            .then(function (response) {
		                    //$scope.searchnames = JSON.parse(response.data.object);
		                      ngNotify.set(response.data.object, 'warn');
		            });
                  };

		$scope.searchsubtitles = function(vid, title) {
			    $http.get("filmjoo/search_subtitle/" + vid + '/' + title )
		            .then(function (response) {
				    //console.log(response.data.object);
		                    //$scope.subtitles = JSON.parse(response.data.object);
				    if(response.data.object) {
					    $scope.subtitles = response.data.object;
				    } else {
					    ngNotify.set("متاسفانه زیرنویسی یافت نشد", 'error');
				    }
		            });
	    	}

            }
        ]);
})();

(function (undefined) {
    'use strict';

    angular
        .module('filmjoo')
        .controller('FilmjooGetMovieController', [
            '$scope',
      	    '$http',
      	    '$state',
      	    'ngNotify',
      	    'Settings',
            '$stateParams',
            function ($scope,$http,$state,ngNotify,Settings,$stateParams) {

                $http.get("/filmjoo/get_movie/" + $stateParams.movieid)
                .then(function (response) {
                        //console.log(response.data.object);
                        //ngNotify.set(response.data.object);
                        $scope.result = JSON.parse(response.data.object);
                });


		$scope.getclips = function(title) {
                      $state.go('stuff', { 'searchtitle':title });
                  };

                $scope.wronginformations = function(vid) {
                      	    $http.get("filmjoo/send_faulty/" + vid)
		            .then(function (response) {
		                    //$scope.searchnames = JSON.parse(response.data.object);
		                      ngNotify.set(response.data.object);
		            });
                  };

                $scope.morality = function(vid) {

		            $http.get("filmjoo/send_report/" + vid)
		            .then(function (response) {
		                    //$scope.searchnames = JSON.parse(response.data.object);
		                      ngNotify.set(response.data.object);
		            });
                  };

		$scope.searchsubtitles = function(vid, title) {
			    $http.get("filmjoo/search_subtitle/" + vid + '/' + title )
		            .then(function (response) {
				    //console.log(response.data.object);
		                    //$scope.subtitles = JSON.parse(response.data.object);
				    $scope.subtitles = response.data.object;
		            });
	    	}

            }
        ]);
})();

(function (undefined) {
    'use strict';

    angular
        .module('stuff')
        .factory('StuffImpl', [
            'Stuff',
            '$interval',
            '$uibModal',
            function (Stuff, $interval, $uibModal) {
                return function ($scope, $uibModalInstance) {

                    return {
                    }
                }
            }
        ]);
})();
(function (undefined) {
    'use strict';

    angular
        .module('stuff')
        .factory('Stuff', [
            'UriManager',
            function (UriManager) {

                var uriManager = new UriManager('stuff');

                return {



                }
            }
        ]);
})();
(function (undefined) {
    'use strict';

    angular
        .module('stuff')
        .config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
            function ($urlRouterProvider, $stateProvider, $locationProvider) {

                /*$urlRouterProvider.otherwise(function ($injector) {
                 $injector.get('$state').transitionTo('root', null, {location: false});
                 });*/
                $urlRouterProvider.otherwise('/');

                $stateProvider
			.state('stuff', {
			    url: '/stuff/:searchtitle',
      	                templateUrl: 'static/ui/modules/stuff/views/stuff-index.html',
	                controller: 'StuffController',
			})
                ;
            }
        ]);
})();

(function (undefined) {
    'use strict';

    angular
        .module('stuff')
        .controller('StuffController', [
            '$scope',
            'StuffImpl',
      	    '$http',
      	    '$state',
      	    'ngNotify',
      	    'Settings',
	    '$stateParams',
            function ($scope, StuffImpl,$http,$state,ngNotify,Settings,$stateParams) {
	                var impl = new StuffImpl($scope);



			if($stateParams.searchtitle) {
				
                 			$http.get("media/youtubeSearch/" + $stateParams.searchtitle)
            				.then(function (response) {
            				        console.log(response.data.object);
            				        $scope.searchnames = JSON.parse(response.data.object);
            				});
			}


            		$scope.downloadit = function(vid) {
            			Settings.session.url = "http://www.youtube.com/watch?v=" + vid;
            			$state.go('media');
            		};

            		$scope.searchit = function() {
					/*
                  				$http.get("media/youtubeSearch/" + $scope.search)
            				.then(function (response) {
            				        console.log(response.data.object);
            				        $scope.searchnames = JSON.parse(response.data.object);
            				});
					*/
					$state.go('stuff', { 'searchtitle':$scope.search });
                }
            }
        ]);
})();

(function (undefined) {
    'use strict';

    angular
        .module('stuff')
        .factory('StuffImpl', [
            'Stuff',
            '$interval',
            '$uibModal',
            function (Stuff, $interval, $uibModal) {
                return function ($scope, $uibModalInstance) {

                    return {
                    }
                }
            }
        ]);
})();
(function (undefined) {
    'use strict';

    angular
        .module('stuff')
        .factory('Stuff', [
            'UriManager',
            function (UriManager) {

                var uriManager = new UriManager('stuff');

                return {



                }
            }
        ]);
})();
(function (undefined) {
    'use strict';

    angular
        .module('user')
        .config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
            function ($urlRouterProvider, $stateProvider, $locationProvider) {

                /*$urlRouterProvider.otherwise(function ($injector) {
                 $injector.get('$state').transitionTo('root', null, {location: false});
                 });*/
                $urlRouterProvider.otherwise('/');

                $stateProvider
                    .state('user', {
                        url: '/user',
                        templateUrl: 'static/ui/modules/user/views/user-index.html',
                        controller: 'UserController',
                        resolve: {
                            feedbacks: [function () {
                                //this function must return feedback list
                                return []; //temporarily
                            }]
                        }
                    })
                ;
            }
        ]);
})();

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

(function (undefined) {
  'use strict';

  angular
    .module('user')
    .factory('UserImpl', [
      'User',
      '$interval',
      '$uibModal',
      'ngNotify',
      function (User, $interval, $uibModal, ngNotify) {
        return function ($scope, $uibModalInstance) {


          var feedback = function () {
            var resp = User.feedback($scope.model);
            if (resp.status == 'ok') {
                return resp.object.History;
            } else {
              console.log(resp.message);
            }
          };

          var downloadsHistory = function (paginationOptions) {
           return User.downloadsHistory(paginationOptions);
          };

          var downloadsHistoryPremium = function (paginationOptions) {
           return User.downloadsHistoryPremium(paginationOptions);
          };

          var downloadsPremiumPurchesPackage = function (paginationOptions) {
           return User.downloadsPremiumPurchesPackage(paginationOptions);
          };

          var addFeedback = function () {
            User.feedback($scope.model)
              .then(function (resp) {
                if (resp.status == 'ok') {
                  alert('feedback was added');
                   ngNotify.set('بازخورد شما فرستاده  شد، از توجه شما متشکریم');
                  $uibModalInstance.close(resp);
                } else {
                  console.log(resp.message);
                }
              }, function (err) {
                console.log(err);
              });
          };

          var dismissModal = function () {
            $uibModalInstance.dismiss();
          };


          var purchase = function (cost) {
           User.purchase({"cost":cost})
               .then(function (resp) {

                   if (resp.status != 'ok') {
                       return;
                   }
                   window.location.assign(resp.object);
                   $uibModalInstance.close(resp);
               }, function (err) {
                   console.log(err);
               });
           };


           var premiumCredit = function () {
               return User.premiumCredit();
            };

            var openSubscribeModal = function () {
                $uibModal
                    .open({
                        size: 'sm',
                        templateUrl: 'static/ui/modules/user/views/user-subscribe-modal.html',
                        controller: 'UserSubscribeController'
                    }).result.then(function(resp){
                         getPagePremium();
                    },function(){
                        getPagePremium();
                    });
            };

            var subscribe = function () {
              console.log('subscribe');
                User.newsletter($scope.model)
                    .then(function (resp) {
                        if (resp.status != 'ok') {
                            ngNotify.set(resp.message, 'error');
                            $uibModalInstance.close(resp);
                            return;
                        }

                        $uibModalInstance.close(resp);
                        ngNotify.set(resp.message);

                    }, function (err) {
                        ngNotify.set(resp.message, 'error');
                    });
            };

            var paginationOptions = {
              pageNumber: 1,
              pageSize: 25,
              sort: null
            };

            var getPurchesList = function() {
                  $scope.listname = "لیست خریدهای انجام شده";
                   $scope.gridOptions = {
                     paginationPageSizes: [25, 50, 75],
                     paginationPageSize: 25,
                     useExternalPagination: true,
                     useExternalSorting: true,
                     enableSorting: false,
                     enableColumnMenus: false,
                     columnDefs: [
                     { field: 'ppp_cost', name:'قیمت بسته خریداری شده'},
                     { field: 'ppp_size', name:'حجم بسته خریداری شده'},
                     { field: 'pud_created_time',  name:'زمان خرید بسته'}
                     ],
                     onRegisterApi: function(gridApi) {
                       $scope.gridApi = gridApi;
                       $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                         if (sortColumns.length == 0) {
                           paginationOptions.sort = null;
                         } else {
                           paginationOptions.sort = sortColumns[0].sort.direction;
                         }
                         getPurchesList();
                       });
                       gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                         paginationOptions.pageNumber = newPage;
                         paginationOptions.pageSize = pageSize;
                         getPurchesList();
                       });
                     }
                   };

                downloadsPremiumPurchesPackage(paginationOptions).then(function (resp) {
                   if (resp.status == 'ok') {
                     $scope.gridOptions.totalItems = resp.rowcount;
                     var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
                     //$scope.gridOptions.data = resp.slice(firstRow, firstRow + paginationOptions.pageSize);
                     $scope.gridOptions.data = resp.object;
                   } else {
                     ngNotify.set(resp.message, 'warn');
                   }
                 });
         };




             var getPagePremium = function() {
                    $scope.listname = "لیست دانلود های ویژه";
                    $scope.gridOptions = {
                      paginationPageSizes: [25, 50, 75],
                      paginationPageSize: 25,
                      useExternalPagination: true,
                      useExternalSorting: true,
                      enableSorting: false,
                      enableColumnMenus: false,
                      columnDefs: [
                      { field: 'pud_link', name:'دانلود شما', cellTemplate: '<div class="ui-grid-cell-contents" ><a target="_blank" href="{{row.entity.pud_link}}">{{row.entity.pud_link}}</a></div>'},
                      { field: 'pud_folder_name', name:'مسیر فایلها', cellTemplate: '<div class="ui-grid-cell-contents" ><a target="_blank" href="{{row.entity.pud_folder_name}}">{{row.entity.pud_folder_name}}</a></div>'},
                      { field: 'pud_state', name:'وضعیت دانلود'},
                      { field: 'pud_size', name:'حجم دانلود'},
                      { field: 'pud_type', name:'نوع دانلود'},
                      { field: 'pud_Clinton_done_time',  name:'نگه داری حداقل تا زمان'}
                      ],
                      onRegisterApi: function(gridApi) {
                        $scope.gridApi = gridApi;
                        $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                          if (sortColumns.length == 0) {
                            paginationOptions.sort = null;
                          } else {
                            paginationOptions.sort = sortColumns[0].sort.direction;
                          }
                          getPagePremium();
                        });
                        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                          paginationOptions.pageNumber = newPage;
                          paginationOptions.pageSize = pageSize;
                          getPagePremium();
                        });
                      }
                    };

                downloadsHistoryPremium(paginationOptions).then(function (resp) {
                    if (resp.status == 'ok') {
                      $scope.gridOptions.totalItems = resp.rowcount;
                      var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
                      //$scope.gridOptions.data = resp.slice(firstRow, firstRow + paginationOptions.pageSize);
                      $scope.gridOptions.data = resp.object;
                    } else {
                      ngNotify.set(resp.message, 'warn');
                    }
                  });
          };

           var getPage = function() {
                  $scope.listname = "لیست دانلودهای عادی";
                 $scope.gridOptions = {
                   paginationPageSizes: [25, 50, 75],
                   paginationPageSize: 25,
                   useExternalPagination: true,
                   useExternalSorting: true,
                   enableSorting: false,
                   enableColumnMenus: false,
                   columnDefs: [
                   { field: 'address', name:'آدرس', cellTemplate: '<div class="ui-grid-cell-contents" ><a target="_blank" href="{{row.entity.address}}">{{row.entity.address}}</a></div>'},
                   { field: 'date', name:'تاریخ'},
                   { field: 'title',  name:'عنوان'}
                   ],
                   onRegisterApi: function(gridApi) {
                     $scope.gridApi = gridApi;
                     $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                       if (sortColumns.length == 0) {
                         paginationOptions.sort = null;
                       } else {
                         paginationOptions.sort = sortColumns[0].sort.direction;
                       }
                       getPage();
                     });
                     gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                       paginationOptions.pageNumber = newPage;
                       paginationOptions.pageSize = pageSize;
                       getPage();
                     });
                   }
                 };

              downloadsHistory(paginationOptions).then(function (resp) {
                  if (resp.status == 'ok') {
                    $scope.gridOptions.totalItems = resp.rowcount;
                    var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
                    //$scope.gridOptions.data = resp.slice(firstRow, firstRow + paginationOptions.pageSize);
                    $scope.gridOptions.data = resp.object;
                  } else {
                    ngNotify.set(resp.message, 'warn');
                  }
                });
        };

      var getCredit = function() {
        $scope.userCredit = 0;
        premiumCredit().then(function (resp) {
            if (resp.status != 'ok') {
                return;
            }

            $scope.restCredit = resp.restCredit;
            $scope.userUsage = resp.userUsage;
            $scope.totalCredit = resp.totalCredit;
        }, function (err) {
            console.log(err);
        });
       };


          return {
            feedback: feedback,
            openSubscribeModal: openSubscribeModal,
            subscribe: subscribe,
            dismissModal: dismissModal,
            addFeedback: addFeedback,
            downloadsHistory: downloadsHistory,
            downloadsHistoryPremium: downloadsHistoryPremium,
            purchase:purchase,
            premiumCredit:premiumCredit,
            downloadsPremiumPurchesPackage:downloadsPremiumPurchesPackage,
            getCredit:getCredit,
            getPage:getPage,
            getPagePremium:getPagePremium,
            getPurchesList:getPurchesList
          }
        }
      }
    ]);
})();

(function (undefined) {
    'use strict';

    angular
        .module('user')
        .factory('User', [
            'UriManager',
            function (UriManager) {

                var uriManager = new UriManager('user');

                return {
                    feedback: function (data) {
                        return uriManager.devResolve({
                            method: 'POST',
                            path: ['downloadsHistory'],
                            data: data
                        });
                    },
                    newsletter: function (data) {
                        return uriManager.resolve({
                            method: 'POST',
                            path: ['newsletter'],
                            data: data
                        });
                    },
                    signUp: function (data) {
                        return uriManager.resolve({
                            method: 'POST',
                            path: ['signup'],
                            data: data
                        });
                    },
                    reset: function(data) {
                      return uriManager.resolve({
                        method: 'POST',
                        path: ['passRemeberStep3'],
                        data: data
                      });
                    },
                    passRemeber: function (data) {
                        return uriManager.resolve({
                            method: 'POST',
                            path: ['passRemeber'],
                            data: data
                        });
                    },
                    login: function (data) {
                        return uriManager.resolve({
                            method: 'POST',
                            path: ['login'],
                            data: data
                        });
                    },
                    downloadsHistory: function (data) {
                        return uriManager.resolve({
                            method: 'POST',
                            path: ['filesList'],
                            data: data
                        });
                    },
                    downloadsHistoryPremium: function (data) {
                        return uriManager.resolve({
                            method: 'POST',
                            path: ['premiumFilesList'],
                            data: data
                        });
                    },
                    downloadsPremiumPurchesPackage: function (data) {
                        return uriManager.resolve({
                            method: 'POST',
                            path: ['purches_list'],
                            data: data
                        });
                    },
                    purchase: function (data) {
                        return uriManager.resolve({
                            method: 'POST',
                            path: ['purchase'],
                            data: data
                        });
                    },
                    premiumCredit: function (data) {
                        return uriManager.resolve({
                            method: 'POST',
                            path: ['premiumCredit']
                        });
                    }

                }
            }
        ]);
})();
