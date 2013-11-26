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
