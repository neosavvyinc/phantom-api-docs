var Neosavvy = Neosavvy || {};

Neosavvy.Constants = angular.module('neosavvy.constants', []);
Neosavvy.Services = angular.module('neosavvy.services', []);
Neosavvy.Controllers = angular.module('neosavvy.controllers', []);
Neosavvy.Filters = angular.module('neosavvy.filters', []);
Neosavvy.Directives = angular.module('neosavvy.directives', []);
Neosavvy.Dependencies = [
    'neosavvy.filters',
    'neosavvy.services',
    'neosavvy.directives',
    'neosavvy.constants',
    'neosavvy.controllers',
    'ngRoute'
];

console.log(Neosavvy.ApiDoc);
angular.module(
    'application',
    Neosavvy.Dependencies.concat(
        'neosavvy.apidoc.directives',
        'neosavvy.apidoc.controllers'
    )
).
  config(
    [
        '$routeProvider',
        function($routeProvider) {

            $routeProvider.when('/docs', {
                templateUrl: '/application/doc/index.html',
                controller: 'DocCtrl'
            });
            $routeProvider.when('/docs/:resource', {
                templateUrl: '/application/doc/detail.html',
                controller: 'DocCtrl'
            });

            $routeProvider.otherwise(
                {
                    templateUrl: '/application/doc/index.html',
                    controller: 'DocCtrl'
                });

            console.log("Starting this mofo");

        }
    ]
);
