var app = angular.module('app', ['ngRoute', 'ngSanitize', 'ngAnimate'])

app.directive('contentview', ['$templateCache', function($templateCache)
{
    return {
        restrict: 'A',
        compile:  function (element)
        {
            $templateCache.put('initialcontent.html', element.html());
        }
    };
}])

app.run(function($templateCache, $http, resourceCache ) {
    $templateCache.put('main.html', '<div class="site-description homepage-description" ng-bind-html="home.content"></div>');
    $templateCache.put('content.html', '<article id="post-{{post.ID}}" class="post-{{post.ID}} {{post.type}} type-{{post.type}}"><header class="entry-header"><h1 class="entry-title">{{post.title}}</h1><div class="entry-details">{{post.acf.entry_details}}</div></header><div class="entry-content" ng-bind-html="post.content"></div></article>');
    $http.get('wp-content/uploads/json/sitedata.json', {cache: resourceCache });    
});  

app.config(function($routeProvider, $locationProvider) {
    var initialized = false;
    $locationProvider.html5Mode(true);
 
    $routeProvider
    .when('/', {
        templateUrl: function() {
            if(initialized){ 
                return 'main.html';

            } else {
                initialized = true;
                return 'initialcontent.html';
            }
        },
        controller: 'Main'
        })

    .when('/:slug/', {
        templateUrl: function() {
            if(initialized){ 
                return 'content.html';

            } else {
                initialized = true;
                return 'initialcontent.html';
            }
        },
        controller: 'Content'
    });

})

app.controller('Content', function($scope, $http, $routeParams, resourceCache ) {
    var view = document.getElementById("page");
    view.scrollIntoView();
    $http.get('wp-content/uploads/json/sitedata.json', {cache: resourceCache }).success(function(res){
        angular.forEach(res, function(postvalue, postkey) {
            if(res[postkey].slug == $routeParams.slug) {
                $scope.post = res[postkey];
                document.querySelector('title').innerHTML = res[postkey].title + ' | Johan Bisse Mattsson';        
            } else if (res[postkey].title == 'Home') {
                $scope.home = res[postkey];
            }
        })
    });  
});

app.controller('Main', function($scope, $http, $routeParams, resourceCache ) {
    var view = document.getElementById("page");
    view.scrollIntoView();
    $http.get('wp-content/uploads/json/sitedata.json', {cache: resourceCache }).success(function(res){
        angular.forEach(res, function(postvalue, postkey) {
            if(res[postkey].title == 'Home') {
                $scope.home = res[postkey];
                document.querySelector('title').innerHTML = 'Johan Bisse Mattsson';                        
            }
        })
    });
});

app.factory("resourceCache",["$cacheFactory",
    function($cacheFactory) { 
      return $cacheFactory("resourceCache"); 
    }
  ]);

app.directive("preloadResource", ["resourceCache", 
    function(resourceCache) {
      return { link: function (scope, element, attrs) { 
        resourceCache.put(attrs.preloadResource, element.html()); 
      }};
    }
  ]);