var app = angular.module('app', ['ngRoute', 'ngSanitize', 'ngAnimate', 'angular-images-loaded']).controller('MainController');

app.directive('contentView', ['$templateCache', function($templateCache)
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
    $templateCache.put('main.html', '<div class="site-description" ng-bind-html="home.content"></div><div class="grid"><div class="grid-sizer"></div><div class="gutter-sizer"></div><div class="grid-item" ng-repeat="postitem in posts" on-last-repeat><a href="{{postitem.link}}" rel="bookmark"><img width="{{postitem.featured_image.attachment_meta.width}}" height="{{postitem.featured_image.attachment_meta.height}}" src="{{postitem.featured_image.source}}" alt="{{postitem.title}}"><h1 class="entry-title">{{postitem.title}}</h1><div class="entry-details">{{postitem.acf.entry_details}}</div></a></div></div>');
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

app.controller('MainController', ['$scope', '$rootScope', '$location', '$timeout', '$anchorScroll',
    function($scope, $rootScope, $location, $timeout, $anchorScroll) {
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

        $scope.gotoTop = function() {
            $scope.currentPath = $location.path();
            if ($scope.currentPath =='/') {
                $rootScope.scrollPos = 0;
                $('html,body').animate({ scrollTop: $rootScope.scrollPos }, 500);    
            }        
        }        

}]);
/*
.controller('ScrollController', ['$scope', '$location', '$anchorScroll',
  function ($scope, $location, $anchorScroll) {
    $scope.gotoBottom = function() {
      // set the location.hash to the id of
      // the element you wish to scroll to.
      $location.hash('bottom');

      // call $anchorScroll()
      $anchorScroll();
    };
  }]);
*/
app.controller('IndexController', ['$scope', '$rootScope', '$http', '$routeParams', '$location', '$timeout', '$anchorScroll', 'resourceCache',
    function($scope, $rootScope, $http, $routeParams, $location, $timeout, resourceCache) {

        //Keep scroll position

        $(window).on('scroll', function() {
            if ($scope.okSaveScroll) { // false between $routeChangeStart and $routeChangeSuccess
                $rootScope.scrollPos = $(window).scrollTop();
            }
        });

        $scope.$on('$routeChangeStart', function() {
                $scope.okSaveScroll = false;
            });

        $scope.$on('$routeChangeSuccess', function() {
            $timeout(function() { // wait for DOM, then restore scroll position
                $(window).scrollTop($rootScope.scrollPos);
                $scope.okSaveScroll = true;
            }, 100); //was 100
        });    

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
}]);

app.controller('ContentController', function($scope, $http, $routeParams, resourceCache ) {

    //Scroll to top
    $scope.$on('$routeChangeSuccess', function() {
        $(window).scrollTop(0);
    });    

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
