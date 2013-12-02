var Neosavvy = Neosavvy || {};

Neosavvy.ApiDoc = Neosavvy.ApiDoc || {};
Neosavvy.ApiDoc.Directives = angular.module('neosavvy.apidoc.directives', []);
Neosavvy.ApiDoc.Controllers = angular.module('neosavvy.apidoc.controllers', []);

var result = document.createElement('div');
Neosavvy.ApiDoc.Directives.directive('nsApiDoc', function ($http) {
    return {
        restrict: 'E',
        templateUrl: 'application/doc/ns-api-doc-ptl.html',
        transclude: true,
        scope: {
            endpoint: '='
        },
        link: function (scope, elem, attrs) {

            scope.summaryText = scope.endpoint.summaryText;
            scope.path = scope.endpoint.path;
            scope.method = scope.endpoint.method;
            scope.params = scope.endpoint.params;
            scope.payload = scope.endpoint.payload ? JSON.stringify(scope.endpoint.payload, undefined, 4) : {};
            scope.expectedSchema = JSON.stringify(scope.endpoint.schema, undefined, 4);

            scope.response = {};
            scope.errors = undefined;

            scope.status = 'ok';

            $http({method: scope.method, url: scope.path, data: scope.payload}).then(function (resp) {
                scope.response = JSON.stringify(resp.data, undefined, 4);
                
                return resp.data;
            }).then(function (resp) {
                return $http.post('/api/validate', {
                    response: resp,
                    schema: scope.endpoint.schema
                });
            }).then(function (resp) {
                console.log(resp);
                if (resp.data.errors.length > 0) {
                    scope.errors = resp.data.errors;
                    scope.status = 'fail';
                }
                elem.find('.status').addClass(scope.status);
            });
            
        }
    }
});

// database state management?
//
// what happens for API responses that may not be the same every time (i.e.
// a date, or timestamp, etc.). Need to find a way to opt-out of checking
// certain API values
//

