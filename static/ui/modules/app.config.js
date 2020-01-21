(function (undefined) {
    'use strict';

    angular
        .module('downloadchibashi')
        .config(['blockUIConfig', function (blockUIConfig) {
            blockUIConfig.message = 'لطفا منتظر بمانید...';
            blockUIConfig.requestFilter = function(config) {
              // If the request starts with '/api/quote' ...
              if(config.url.indexOf('media/state') >= 0 || config.url.indexOf('search/') >= 0) {
                return false; // ... don't block it.
              }

              return true;
            };
        }]);
})();
