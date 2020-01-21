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