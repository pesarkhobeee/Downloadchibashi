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