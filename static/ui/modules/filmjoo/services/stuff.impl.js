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