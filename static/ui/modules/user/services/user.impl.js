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
