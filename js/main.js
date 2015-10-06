var app = angular.module('app', ['ui.router', 'ct.ui.router.extras', 'ngSanitize', 'ngAnimate', 'angular-images-loaded']).controller('MainController');

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

app.directive('indexView', ['$templateCache', function($templateCache)
{
    return {
        restrict: 'A',
        compile:  function (element)
        {
            $templateCache.put('indexview-initialcontent.html', element.html());
        }
    };
}])

app.directive('postView', ['$templateCache', function($templateCache)
{
    return {
        restrict: 'A',
        compile:  function (element)
        {
            $templateCache.put('postview-initialcontent.html', element.html());
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
    $templateCache.put('indexview.html', '<div class="site-description" ng-bind-html="data.home.content"></div><div class="grid effect" images-loaded="imgLoadedEvents"><div class="grid-sizer"></div><div class="gutter-sizer"></div><div class="grid-item" ng-repeat="postitem in data.posts" on-last-repeat><a href="{{postitem.link}}" rel="bookmark"><img ng-src="{{postitem.featured_image.source}}" width="{{postitem.featured_image.attachment_meta.width}}" height="{{postitem.featured_image.attachment_meta.height}}" alt="{{postitem.title}}"><h1 class="entry-title">{{postitem.title}}</h1><div class="entry-details">{{postitem.acf.entry_details}}</div></a></div>');
    $templateCache.put('postview.html', '<article id="post-{{data.post.ID}}" class="post-{{data.post.ID}} {{data.post.type}} type-{{data.post.type}}"><header class="entry-header"><h1 class="entry-title">{{data.post.title}}</h1><div class="entry-details">{{data.post.acf.entry_details}}</div></header><div class="entry-content" ng-bind-html="data.post.content"></div></article>');
    $http.get('wp-content/uploads/json/sitedata.json', {cache: resourceCache });
});

app.controller('MainController', ['$scope', '$rootScope', '$state', '$location', '$timeout', '$anchorScroll', 'stateStatusService',
    function($scope, $rootScope, $state, $location, $timeout, $anchorScroll, stateStatusService) {

    /*$scope.$on('$routeChangeStart', function() {
            $scope.okSaveScroll = false;
        });

    $scope.$on('$routeChangeSuccess', function() {
        $timeout(function() { // wait for DOM, then restore scroll position
            $(window).scrollTop($rootScope.scrollPos);
            $scope.okSaveScroll = true;
        }, 100); //was 100
    });*/


/*$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {
  if (toState.redirectTo) {
    event.preventDefault();
    $state.go(toState.redirectTo, toParams);
  }
});*/
/*
        $rootScope.$on('$stateChangeStart', 
        function(event, toState, toParams, fromState, fromParams, $state){

            if (!stateStatusService.startState()) {
                if (toState.name == 'index') {
                    stateStatusService.indexInitialized(true);
                }
                stateStatusService.startState(toState.name);
                console.log("Start state is... " + stateStatusService.startState());
            }

            if (toState.name == 'index') {
                if (!stateStatusService.indexInitialized()) {
                    if (toState.redirectTo) {
                        event.preventDefault();
                        $state.go(toState.redirectTo, toParams);                
                    }
                }
            }
*/

/*
            if (toState.name == 'index') {
                event.preventDefault();
                if(stateStatusService.indexInitialized()) {
                    stateStatusService.dataFromJSON(true);
                    console.log("holabandola");                    
                } else {
                    stateStatusService.dataFromJSON(true);
                    stateStatusService.indexInitialized(true);
                    $state.go('index.init');                 
                }
            }

*/
            //console.log("set saveScroll temporarily false");
            //stateStatusService.saveScroll(false);
    //    });

/*
        $rootScope.$on('$locationChangeStart', 
        function(event, newUrl, oldUrl, newState, oldState){

            console.log(newUrl);

        });

*/
        $rootScope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams ) {
            if (toState.name == "post") {
                $('body').removeClass('index').addClass('single');
            } else {
                $('body').removeClass('single').addClass('index');                
            }
        });

            /*
            if (toState.name == "post") {
                $('body').removeClass('index').addClass('post', function(event) {
                    console.log("hej");
                });
            } else {
                $('body').removeClass('post').addClass('index', function(event) {
                    console.log("svejs");
                });                
            }
            */            


        $scope.imgLoadedEvents = {
            always: function(instance) {
                // Do stuff
            },
            done: function(instance) {
                angular.element(instance.elements[0]).addClass('loaded');
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
/*
        //Keep scroll position
            $(window).on('scroll', function() {
                if (stateStatusService.currentState() == "index") {
                    console.log($(window).scrollTop());
                    if (stateStatusService.saveScroll()) { // false between $routeChangeStart and $routeChangeSuccess
                        stateStatusService.scrollPos($(window).scrollTop());
                    }
                }        

            });
*/
        $scope.gotoTop = function() {
            $scope.currentPath = $location.path();
            if ($scope.currentPath =='/') {
                stateStatusService.scrollPos(0);
                $('html,body').animate({ scrollTop: 0}, 500);    
            }        
        }        

}]);

app.run(function($rootScope, $state, $location, stateStatusService) {

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
        if (toState.name == 'index') {
            document.querySelector('title').innerHTML = 'Johan Bisse Mattsson';            
        }
    });

    /*
    $rootScope.$on('$stateChangeStart', function(evt, to, params) {
            if (!stateStatusService.indexInitialized()) {
      
      if (to.redirectTo) {
        evt.preventDefault();
        $state.go(to.redirectTo, params)
      }
  }
    });


        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
            console.log("Current toState is..." + toState.name);
        });    
*/

    /* -----
    $rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
        console.log($location.path());

        // lägg till startstate koll innan!
        if ($location.path() == "/") {
            if (stateStatusService.indexInitialized()) {
                //event.preventDefault();
                console.log("STOPP och BELÄGG!");
            } else {
                console.log("index.init!!!!!");
                event.preventDefault();                
                //stateStatusService.indexInitialized(true);
                $state.go("index.init");
            }
        }
    });


    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {
        if (!stateStatusService.startState()) {
            if (toState.name == 'index') {
                console.log("initialize index");
                stateStatusService.indexInitialized(true);
            }
            stateStatusService.startState(toState.name);
            console.log("Start state is... " + stateStatusService.startState());
        }
        console.log("hej :" + toState.name);
    });

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
            console.log("Current toState is..." + toState.name);
        });


        -------*/

        /*
        if (toState.name == 'index') {
            if (!stateStatusService.indexInitialized()) {
                if (toState.redirectTo) {
                    stateStatusService.indexInitialized(true);
                    console.log("redirect");
                    event.preventDefault();
                    $state.go(toState.redirectTo, toParams);                
                }
            } else {
                event.preventDefault();                
                console.log("else");
            }
        }
        */   
    //});
})



app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $urlMatcherFactoryProvider, stateStatusService) {
    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('index', {
        url: '/',
        sticky: true,
        resolve: {
            indexTemplateCacheOrInitialContent: function ($templateRequest, stateStatusService) {                
                if(stateStatusService.dataFromJSON()) {
                    console.log("get indexview.html (json)");                                                                    
                    return $templateRequest('indexview.html');
                } else {
                    console.log("get initialcontent.html (php)");                                                                                        
                    return $templateRequest('indexview-initialcontent.html');                    
                }
            },
            promiseObj: function ($stateParams, resourceCache, stateStatusService, wpService) {
                if (stateStatusService.dataFromJSON()) {
                    //stateStatusService.indexInitialized(true);                                        
                    stateStatusService.indexInitialized(true);                                        
                    return wpService.getIndex();
                    return wpService;                                    
                } else {
                    stateStatusService.dataFromJSON(true);
                    stateStatusService.indexInitialized(true);                    
                } 
                return;
            }         
        },
        views: {
            'indexView@': {
                templateProvider: function(indexTemplateCacheOrInitialContent, stateStatusService) {
                    return indexTemplateCacheOrInitialContent;
                },
                controller: 'IndexController'           
            }
        }
    })             

    .state('post', {
        url: '/:slug/',
        sticky: 'true',
        resolve: {
            postTemplateCacheOrInitialContent: function ($templateRequest, stateStatusService) {
                if(stateStatusService.dataFromJSON()) {
                    console.log("get postview.html (json)");                                                                    
                    return $templateRequest('postview.html');
                } else {
                    console.log("get initialcontent.html (php)");                                                                                        
                    return $templateRequest('postview-initialcontent.html');                    
                }
            },
            promiseObj: function ($stateParams, resourceCache, stateStatusService, wpService) {                                
               if (stateStatusService.dataFromJSON()) {
                    return wpService.getPost($stateParams.slug);
                    return wpService;
                } else {
                    console.log("initDataFromJSON (post state)");
                    stateStatusService.dataFromJSON(true);
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
    });  
});


/*
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
                    console.log("get initialcontent.html (php)");                                                                                        
                    return $templateRequest('initialcontent.html');                    
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
            'contentView@': {
                templateProvider: function(indexTemplateCacheOrInitialContent, stateStatusService) {
                    if (!stateStatusService.indexLoaded()) {
                        console.log("IndexLoaded: " + stateStatusService.indexLoaded());                        
                        return indexTemplateCacheOrInitialContent;
                    } else {
                        console.log("Index already has been loaded so skip view part");
                    }
                },
                controller: 'IndexController'           
            }
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
                    console.log("get initialcontent.html (php)");                                                                                        
                    return $templateRequest('initialcontent.html');                    
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

*/

app.controller('IndexController', ['$scope', 'promiseObj', '$timeout', '$anchorScroll', 'stateStatusService', function($scope, promiseObj, $timeout, $anchorScroll, stateStatusService) {
    if(promiseObj) {
        $scope.data = promiseObj;       
    };
}]);

app.controller('PostController', ['$scope','promiseObj', function($scope, promiseObj) {
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
            return $http.get('wp-content/uploads/json/sitedata.json',{cache: resourceCache }).success(function(resindex){
                angular.forEach(resindex, function(postvalue, postkey) {
                    if(resindex[postkey].title == 'Home') {
                        wpService.home = resindex[postkey];
                    } else if(resindex[postkey].slug == $stateParams.slug) {
                        wpService.posts = resindex[postkey];
                    }
                });

                for(var i = resindex.length - 1; i >= 0; i--) {
                    if(resindex[i].type !=  'post') {
                        resindex.splice(i, 1);
                    }
                }
                wpService.posts = resindex;
            }).then(function() {
                return wpService;
            });      
        };

        wpService.getPost = function(slug) {
            return $http.get('wp-content/uploads/json/sitedata.json',{cache: resourceCache }).success(function(respost){
                angular.forEach(respost, function(postvalue, postkey) {
                    if(respost[postkey].slug == slug) {
                        wpService.post = respost[postkey];
                        document.querySelector('title').innerHTML = respost[postkey].title + ' | Johan Bisse Mattsson';        
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
    var boolSaveScroll = true;    
    var intScrollPos = 0;
    var boolStringInitialized = false;
    var varrenameThis = 0;

    return {
        startState: function (value) {
            if (value) {
                stringStartState = value;
                return;
            } else {
                return stringStartState;            
            }
        },
        dataFromJSON: function (value) {
            if (value) {
                boolDataFromJSON = value;
                return;
            } else {
                return boolDataFromJSON;
            }
        },
        indexLoaded: function (value) {
            if (value) {
                boolIndexLoaded = value;
                return;
            } else {
                return boolIndexLoaded;
            }
        },
        saveScroll: function (value) {
            if (value) {
                boolSaveScroll = value;
                return;
            } else {
                return boolSaveScroll;
            }            
        },
        scrollPos: function (value) {
            if (value) {
                intScrollPos = value;
                return;
            } else {
                return intScrollPos;
            }            
        },
        indexInitialized: function (value) {
            if (value) {
                boolStringInitialized = value;
                return;
            } else {
                return boolStringInitialized;
            }
        },
        renameThis: function (value) {
            if (value) {
                varrenameThis = value;
                return;
            } else {
                return varrenameThis;
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