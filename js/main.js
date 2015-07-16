var app = angular.module('app', ['ngRoute', 'ngSanitize', 'ngAnimate', 'angular-images-loaded']).controller('MainController');

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

app.directive('onLastRepeat', function() {
    return function(scope, element, attrs) {
        if (scope.$last) setTimeout(function(){
            scope.$emit('onRepeatLast', element, attrs);
        }, 1);
    };
});

app.run(function($templateCache, $http, resourceCache ) {
    $templateCache.put('main.html', '<div class="site-description" ng-bind-html="home.content"></div><div class="grid"><div class="grid-sizer"></div><div class="gutter-sizer"></div><div class="grid-item" ng-repeat="postitem in posts" on-last-repeat><a href="{{postitem.slug}}/" rel="bookmark"><img width="{{postitem.featured_image.attachment_meta.width}}" height="{{postitem.featured_image.attachment_meta.height}}" src="{{postitem.featured_image.source}}" alt="{{postitem.title}}"><h1 class="entry-title">{{postitem.title}}</h1><div class="entry-details">{{postitem.acf.entry_details}}</div></a></div></div>');
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
        controller: 'IndexController'
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
        controller: 'ContentController'
    });



})

app.controller('MainController', function($scope ) {
        $scope.imgLoadedEvents = {

            always: function(instance) {
                // Do stuff
            },

            done: function(instance) {
                    //angular.element(instance.elements[0]).addClass('loaded');
                var iso = new Isotope( '.grid', {
                    percentPosition: "true",
                    itemSelector: '.grid-item',
                    layoutMode: 'masonry',
                    transitionDuration: '0',
                    masonry: {
                        columnWidth: '.grid-sizer',
                        gutter: '.gutter-sizer'
                    }        
                });
            },

            fail: function(instance) {
                // Do stuff
            }

        };    
});

app.controller('IndexController', function($scope, $rootScope, $http, $routeParams, resourceCache) {

    $http.get('wp-content/uploads/json/sitedata.json', {cache: resourceCache }).success(function(res){
        angular.forEach(res, function(postvalue, postkey) {
            if(res[postkey].title == 'Home') {
                $scope.home = res[postkey];
                document.querySelector('title').innerHTML = 'Johan Bisse Mattsson';                        
            } else if(res[postkey].slug == $routeParams.slug) {
                $scope.post = res[postkey];
            }
        })

        $scope.imgLoadedEvents = {

            always: function(instance) {
                // Do stuff
            },

            done: function(instance) {
                    //angular.element(instance.elements[0]).addClass('loaded');
                var iso = new Isotope( '.grid', {
                    percentPosition: "true",
                    itemSelector: '.grid-item',
                    layoutMode: 'masonry',
                    transitionDuration: '0',
                    masonry: {
                        columnWidth: '.grid-sizer',
                        gutter: '.gutter-sizer'
                    }        
                });
            },

            fail: function(instance) {
                // Do stuff
            }

        };           

        $scope.posts = res.filter(function(obj) {
            if ('type' in obj && obj.type != 'post') {
                return false;
            } else {
                return true;
            }
        });
    });

    $scope.$on('onRepeatLast', function(scope, element, attrs){
        
        imagesLoaded( '.grid', function() {
            var iso = new Isotope( '.grid', {
                percentPosition: "true",
                itemSelector: '.grid-item',
                layoutMode: 'masonry',
                transitionDuration: '0',
                masonry: {
                    columnWidth: '.grid-sizer',
                    gutter: '.gutter-sizer'
                }        
            });
        });
    });    

});

app.controller('ContentController', function($scope, $http, $routeParams, resourceCache ) {
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
