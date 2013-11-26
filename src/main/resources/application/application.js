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
    Neosavvy.Dependencies.concat('neosavvy.apidoc.directives', 'neosavvy.apidoc.controllers')
).
  config(
    [
        '$routeProvider',
        function($routeProvider) {


            $routeProvider.when('/index', {
                templateUrl: '/application/view/content/home-ptl.html'
    //            controller: HomeController,
    //            controllerAs: 'book'
            });
            $routeProvider.when('/grid', {
                templateUrl: '/application/view/content/grid-ptl.html'
    //            controller: ChapterCntl,
    //            controllerAs: 'chapter'
            });
            $routeProvider.when('/list', {
                templateUrl: '/application/view/content/list-ptl.html'
    //            controller: ChapterCntl,
    //            controllerAs: 'chapter'
            });
            $routeProvider.when('/docs', {
                templateUrl: '/application/doc/index.html',
                controller: 'DocCtrl'
            });
            $routeProvider.when('/docs/:resource', {
                templateUrl: '/application/doc/detail.html',
                controller: 'DocCtrl'
            });

            $routeProvider.otherwise({templateUrl: '/application/view/content/home-ptl.html'});

            console.log("Starting this mofo");

        }
    ]
);
