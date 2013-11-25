var Neosavvy = Neosavvy || {};

Neosavvy.ApiDoc = Neosavvy.ApiDoc || {};
Neosavvy.ApiDoc.Directives = angular.module('neosavvy.apidoc.directives', []);

var result = document.createElement('div');
function changed(a, b) {
	var diff = JsDiff.diffLines(a, b);
	var fragment = document.createDocumentFragment();
	for (var i=0; i < diff.length; i++) {

		if (diff[i].added && diff[i + 1] && diff[i + 1].removed) {
			var swap = diff[i];
			diff[i] = diff[i + 1];
			diff[i + 1] = swap;
		}

		var node;
		if (diff[i].removed) {
			node = document.createElement('del');
			node.appendChild(document.createTextNode(diff[i].value));
		} else if (diff[i].added) {
			node = document.createElement('ins');
			node.appendChild(document.createTextNode(diff[i].value));
		} else {
			node = document.createTextNode(diff[i].value);
		}
		fragment.appendChild(node);
	}

	result.textContent = '';
	result.appendChild(fragment);
    return result;
};

Neosavvy.ApiDoc.Directives.directive('nsApiDoc', function ($http) {
    return {
        restrict: 'E',
        templateUrl: 'application/doc/ns-api-doc-ptl.html',
        transclude: true,
        link: function ($scope, elem, attrs) {

            var expectedResponse = [
                {
                    id: 1,
                    name: "Adam Parrish",
                    home: "Brooklyn"
                },
                {
                    id: 2,
                    name: "Trevor Ewen",
                    home: "Queens"
                },
                {
                    id: 3,
                    name: "Chris Caplinger",
                    home: "Brooklyn"
                }
            ];

            $scope.endpoint = '/api/dudes';
            $scope.method = 'GET';
            $scope.params = 'None';
            $scope.payload = {};
            $scope.expectedResponse = JSON.stringify(expectedResponse, undefined, 4);
            $scope.actualResponse = {};

            $scope.status = 'fail';

            $http.get('/api/dudes').then(function (resp) {
                var actualResponse = JSON.stringify(resp.data, undefined, 4);
                $scope.status = angular.equals(resp.data, expectedResponse) ? 'ok' : 'fail';
                elem.find('.status').addClass($scope.status);

                var result = changed(actualResponse, $scope.expectedResponse);
                elem.find('.actual').append(result);
            });
            
        }
    }
})
