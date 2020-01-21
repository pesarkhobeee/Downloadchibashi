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
