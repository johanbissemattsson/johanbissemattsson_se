var app = angular.module('app', ['ui.router', 'ngSanitize', 'ngAnimate', 'angular-images-loaded']).controller('MainController');

app.directive('indexView', ['$templateCache', function($templateCache)
{
    return {
        restrict: 'A',
        compile:  function (element)
        {
            $templateCache.put('initialcontent-indexview.html', element.html());
        }
    };
}])

app.directive('postView', ['$templateCache', function($templateCache)
{
    return {
        restrict: 'A',
        compile:  function (element)
        {
            $templateCache.put('initialcontent-postview.html', element.html());
        }
    };
}])

app.directive("preloadResource", ["resourceCache", 
    function(resourceCache) {
      return { link: function (scope, element, attrs) { 
        resourceCache.put(attrs.preloadResource, element.html()); 
      }};
    }
]);

app.directive('onLastRepeat', function() {
    return function(scope, element, attrs) {
        if (scope.$last) setTimeout(function(){
            scope.$emit('onRepeatLast', element, attrs);
        }, 1);
    };
});

app.run(function($templateCache, $http, resourceCache) {
    $templateCache.put('indexview.html', '<p>Från indexview.html</p><div class="site-description" ng-bind-html="data.home.content"></div><div class="grid"><div class="grid-sizer"></div><div class="gutter-sizer"></div><div class="grid-item" ng-repeat="postitem in data.posts" on-last-repeat><a href="{{data.postitem.link}}" rel="bookmark"><img width="{{data.postitem.featured_image.attachment_meta.width}}" height="{{data.postitem.featured_image.attachment_meta.height}}" src="{{data.postitem.featured_image.source}}" alt="{{data.postitem.title}}"><h1 class="entry-title">{{data.postitem.title}}</h1><div class="entry-details">{{data.postitem.acf.entry_details}}</div></a></div></div>');
    $templateCache.put('postview.html', '<p>Från postview.html</p><article id="post-{{data.post.ID}}" class="post-{{data.post.ID}} {{data.post.type}} type-{{data.post.type}}"><header class="entry-header"><h1 class="entry-title">{{data.post.title}}</h1><div class="entry-details">{{data.post.acf.entry_details}}</div></header><div class="entry-content" ng-bind-html="data.post.content"></div></article>');
    $http.get('wp-content/uploads/json/sitedata.json', {cache: resourceCache });
});

app.controller('MainController', ['$scope', '$rootScope', '$state', '$location', '$timeout', '$anchorScroll', 'stateStatusService',
    function($scope, $rootScope, $state, $location, $timeout, $anchorScroll, stateStatusService) {

        $rootScope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams ) {
            $state.current = toState;
            if(toState.name == "index") {
                $scope.postView = false;
                stateStatusService.indexLoaded(true);
            } else {
                $scope.postView = true;
                console.log("JENGIJENGJE");
            }

        });

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

app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $urlMatcherFactoryProvider, stateStatusService) {
    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('index', {
        url: '/',
        resolve: {
            indexTemplateCacheOrInitialContent: function ($templateRequest, stateStatusService) {                
                if(stateStatusService.dataFromJSON()) {
                    if (!stateStatusService.indexLoaded()) {                    
                        console.log("get indexview.html (json)");                                                                    
                        return $templateRequest('indexview.html');
                    } else {
                        console.log("Index already has been loaded so skip resolve part");                        
                        return;
                    }
                } else {
                    console.log("get initialcontent-indexview.html (php)");                                                                                        
                    return $templateRequest('initialcontent-indexview.html');                    
                }
            },
            promiseObj: function ($stateParams, resourceCache, stateStatusService, wpService) {
                if (stateStatusService.dataFromJSON()) {
                    return wpService.getIndex();
                    return wpService;                                    
                } else {
                    console.log("initDataFromJSON (index state)");
                    stateStatusService.initDataFromJSON();
                } 
                return;
            }
        },
        views: {
            'indexView@': {
                templateProvider: function(indexTemplateCacheOrInitialContent, stateStatusService) {
                    if (!stateStatusService.indexLoaded()) {
                        console.log("IndexLoaded: " + stateStatusService.indexLoaded());                        
                        return indexTemplateCacheOrInitialContent;
                    } else {
                        console.log("Index already has been loaded so skip view part");
                    }
                },
                controller: 'IndexController'           
            },
            /*'postView@': {
                template: "&nbsp;"
            }*/
        }
    })
    .state('post', {
        url: '/:slug/',
        resolve: {
            postTemplateCacheOrInitialContent: function ($templateRequest, stateStatusService) {
                if(stateStatusService.dataFromJSON()) {
                    console.log("get postview.html (json)");                                                                    
                    return $templateRequest('postview.html');
                } else {
                    console.log("get initialcontent-postview.html (php)");                                                                                        
                    return $templateRequest('initialcontent-postview.html');                    
                }
            },
            promiseObj: function ($stateParams, resourceCache, stateStatusService, wpService) {                                
               if (stateStatusService.dataFromJSON()) {
                    return wpService.getPost($stateParams.slug);
                    return wpService;
                } else {
                    console.log("initDataFromJSON (post state)");
                    stateStatusService.initDataFromJSON();
                } 
                return;
            }
        },
        views: {
            'postView@': {
                templateProvider: function(postTemplateCacheOrInitialContent) {
                    return postTemplateCacheOrInitialContent;
                },
                controller: 'PostController'           
            }
        }
    })  
});

app.controller('IndexController', ['$scope', 'promiseObj', function($scope, promiseObj) {
    $( "body" ).removeClass( "single" );        
    if(promiseObj) {
        $scope.data = promiseObj;       
    };
}]);

app.controller('PostController', ['$scope','promiseObj', function($scope, promiseObj) {
    $( "body" ).addClass( "single" );    
    if(promiseObj) {
        $scope.data = promiseObj;       
    }
}]);

app.factory("resourceCache",["$cacheFactory",
    function($cacheFactory) { 
      return $cacheFactory("resourceCache"); 
    }
]);

app.factory('wpService', ['$http', '$q', '$stateParams', 'resourceCache', function($http, $q, $stateParams, resourceCache) {
        var wpService = {
            post: [],
            posts: [],
            pages: [],
            home: []
        };

        wpService.getIndex = function() {
            return $http.get('wp-content/uploads/json/sitedata.json',{cache: resourceCache }).success(function(res){
                angular.forEach(res, function(postvalue, postkey) {
                    if(res[postkey].title == 'Home') {
                        wpService.home = res[postkey];
                        document.querySelector('title').innerHTML = 'Johan Bisse Mattsson';                        
                    } else if(res[postkey].slug == $stateParams.slug) {
                        wpService.posts = res[postkey];
                    }
                });                
                wpService.posts = res;
            }).then(function() {
                return wpService;
            });      
        };

        wpService.getPost = function(slug) {
            return $http.get('wp-content/uploads/json/sitedata.json',{cache: resourceCache }).success(function(res){
                angular.forEach(res, function(postvalue, postkey) {
                    if(res[postkey].slug == slug) {
                        wpService.post = res[postkey];
                        document.querySelector('title').innerHTML = res[postkey].title + ' | Johan Bisse Mattsson';        
                    }
                });
            }).then(function() {
                return wpService;
            });
        };

        return wpService;        

}]);


app.service('stateStatusService', function () {
    var stringStartState;
    var boolDataFromJSON = false;
    var boolIndexLoaded = false;

    return {
        startState: function (value) {
            stringStartState = value;
            return stringStartState;            
        },
        dataFromJSON: function () {
            return boolDataFromJSON;
        },
        initDataFromJSON: function () {
            boolDataFromJSON = true;
            return;
        },
        indexLoaded: function (value) {
            if (value) {
                boolIndexLoaded = value;
                return;
            } else {
                return boolIndexLoaded;
            }
        }
    }
});


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
/*

app.controller('IndexController', ['$scope', 'promiseObj', '$rootScope', '$http', '$stateParams', '$location', '$timeout', '$anchorScroll', 'resourceCache', 
    function($scope, promiseObj, $rootScope, $http, $stateParams, $location, $timeout, resourceCache) {

        if(promiseObj) {
            $scope.data = promiseObj;       
        }        

        console.log("indexcontroller");

*/

                                //Keep scroll position
                        /*
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
                        */
/*
        $http.get('wp-content/uploads/json/sitedata.json', {cache: resourceCache }).success(function(res){
            angular.forEach(res, function(postvalue, postkey) {
                if(res[postkey].title == 'Home') {
                    $scope.home = res[postkey];
                    document.querySelector('title').innerHTML = 'Johan Bisse Mattsson';                        
                } else if(res[postkey].slug == $stateParams.slug) {
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
*/
/*
app.controller('PostController', ['$scope', 'promiseObj', '$rootScope', '$http', '$stateParams', '$location', '$timeout', '$anchorScroll', 'resourceCache', 
    function($scope, promiseObj, $rootScope, $http, $stateParams, $location, $timeout, resourceCache) {
    
    if(promiseObj) {
        $scope.data = promiseObj;       
    }
*/

    //Scroll to top
    /*$scope.$on('$routeChangeSuccess', function() {
        $(window).scrollTop(0);
    });*/
/*
    $http.get('wp-content/uploads/json/sitedata.json', {cache: resourceCache }).success(function(res){
        angular.forEach(res, function(postvalue, postkey) {
            if(res[postkey].slug == $stateParams.slug) {
                $scope.post = res[postkey];
                document.querySelector('title').innerHTML = res[postkey].title + ' | Johan Bisse Mattsson';        
            } else if (res[postkey].title == 'Home') {
                $scope.home = res[postkey];
            }
        })
    });  
}]);
*/