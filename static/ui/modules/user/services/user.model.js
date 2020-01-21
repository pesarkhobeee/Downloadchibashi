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
