var Neosavvy = Neosavvy || {};

Neosavvy.ApiDoc = Neosavvy.ApiDoc || {};
Neosavvy.ApiDoc.Directives = angular.module('neosavvy.apidoc.directives', []);
Neosavvy.ApiDoc.Controllers = angular.module('neosavvy.apidoc.controllers', []);

Neosavvy.ApiDoc.Controllers.controller('DocCtrl', function ($scope, $route, $http) {
    $scope.resources = undefined;
    $scope.endpoints = undefined;

    $http.get('application/doc/schema.json').then(function (resp) {
        console.log(resp.data);
        $scope.resources = resp.data;

        if ($route.current.params.resource) {
            $scope.endpoints = _.find($scope.resources, function (resource) {
                return resource.name === $route.current.params.resource;
            }).endpoints;
        };
    });
});
