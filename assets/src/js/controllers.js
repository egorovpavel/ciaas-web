'use strict';

/* Controllers */

angular.module('CI.controllers', [])
    .controller('ConfigController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
        $scope.buildId = undefined;
        $scope.build = function (commands) {
            $http.post('/dashboard', {commands: commands}).success(function (data, status, headers, config) {
                $location.path('/build/' + data.id);
            }).error(function (data, status, headers, config) {
                $scope.error = data;
            });
        };
    }])
    .controller('BuildResultController', ['$scope', '$routeParams', 'iosocket', function ($scope, $routeParams, iosocket) {

        $scope.buildId = $routeParams.buildid;
        $scope.lines = [];
        iosocket.emit("build.feed", {
            id: $scope.buildId
        });
        iosocket.on('channel_' + $scope.buildId, function (data) {
            var splited = data.message.split("\r\r");
            if (splited.length > 1) {
                console.log("splited");
            }
            if (/^\r[^\r]/.test(data.message) && !/^\r\n/.test(data.message)) {
                console.log("pop");
                $scope.lines.pop();
            }
            $scope.lines.push(data.message);
        });
    }]);