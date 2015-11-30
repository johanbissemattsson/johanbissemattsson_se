var app = angular.module('app', ['ui.router', 'ct.ui.router.extras', 'ngSanitize', 'ngAnimate']).controller('MainController');

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
    $templateCache.put('indexview.html', '<div class="site-description" ng-bind-html="data.home.content"></div><div class="grid"><div class="grid-item" ng-repeat="postitem in data.posts"><a href="{{postitem.link}}" rel="bookmark" ng-click="onPostItemClick(postitem)" ng-class="{selected : isSelected(postitem)}"><img ng-src="{{postitem.featured_image.source}}" width="{{postitem.featured_image.attachment_meta.width}}" height="{{postitem.featured_image.attachment_meta.height}}" alt="{{postitem.title}}" class="attachment-{{postitem.slug}}-thumbnail"><h1 class="entry-title">{{postitem.title}}</h1><span class="entry-details">{{postitem.acf.entry_details}}</span></a></div>');
    $templateCache.put('postview.html', '<article id="post-{{data.post.ID}}" class="post-{{data.post.ID}} {{data.post.type}} type-{{data.post.type}}"><header class="entry-header"><h1 class="entry-title">{{data.post.title}}</h1><span class="entry-details">{{data.post.acf.entry_details}}</span><div class="featured-image"><img ng-src="{{data.post.featured_image.source}}" width="{{data.post.featured_image.attachment_meta.width}}" height="{{data.post.featured_image.attachment_meta.height}}" alt="{{data.post.title}}"></div></header><div class="entry-content" ng-bind-html="data.post.content"></div></article>');
    $http.get('wp-content/uploads/json/sitedata.json', {cache: resourceCache });
});

app.controller('MainController', ['$scope', '$rootScope', '$state', '$location', '$timeout', '$anchorScroll', 'stateStatusService',
    function($scope, $rootScope, $state, $location, $timeout, $anchorScroll, stateStatusService) {

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
        if (!stateStatusService.startState()) {
            stateStatusService.startState(toState.name);
            console.log("Start state is: " + stateStatusService.startState());
        }
    });

    /*
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
        if (fromState.name == "post" && toState.name == "index") {
            TweenMax.to(".post-view article", 0.5, {autoAlpha: 0, onComplete: onFadeoutCompleted});
        } else if ((fromState.name == "index" || fromState.name == "index.animationFinished") && toState.name == "post") {
            TweenMax.killTweensOf(".post-view article");
            TweenMax.fromTo(".post-view article", 1, {autoAlpha: 0}, {autoAlpha: 1});
        }


    });

        function onFadeoutCompleted(event) {
            console.log("Fadeout animation has finished");              
            $state.go("index.animationFinished");
        }
    */
/*  
    var tl = new TimelineMax({onComplete: onTimelineCompleted});

    var tlFadeinPost = new TimelineMax({onStart: onFadeinStart, paused: true});
        tlFadeinPost.to(".post-view article", 1, {autoAlpha: 1});

    var tlFadeoutPost = new TimelineMax({onStart: onFadeoutStart, paused: true});
        tlFadeoutPost.to(".post-view article", 1, {autoAlpha: 0, onComplete: onFadeoutCompleted});        


    $scope.$on('$viewContentLoaded', function (event) {
        console.log(stateStatusService.currentState());
    });


    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {

        if (fromState.name == "post" && toState.name == "index") {
            stateStatusService.currentState(toState.name);
            tl.clear();
            tl.add(tlFadeoutPost.play());

        } else if ((fromState.name == "index" || fromState.name == "index.animationFinished") && toState.name == "post") {
            tl.clear();
            tl.add(tlFadeinPost.play());
        }
    });

    function onFadeinStart(event) {
        console.log("onFadeinStart");
        TweenMax.set("body", {className: "single"});        
    }

    function onFadeinCompleted(event) {
        console.log("Fadein animation has finished");              
    }    

    function onFadeoutStart(event) {
        console.log("onFadeoutStart");
        TweenMax.set("body", {className: "index"});
    }

    function onFadeoutCompleted(event) {
        console.log("Fadeout animation has finished");              
        $state.go("index.animationFinished");
    }

    function onTimelineCompleted(event) {
        console.log("onTimelineCompleted");      
    }
*/

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

        // ------------------
        // FLYTTA TILL RESOLVE?????? KOLLA STATE! KÖRS ANNARS FLERA GGR.
        // ------------------
/*
        $scope.$on('$viewContentLoaded',
        function(event, stateStatusService) {
            if ($location.path() == '/') {
                $('body').removeClass('single').addClass('index');                
            } else {
                $('body').removeClass('index').addClass('single');
                stateStatusService.indexInitialized(true);            
            }
        });
*/
        /*$rootScope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams ) {
            if (toState.name == "post") {
                $('body').removeClass('index').addClass('single');
            } else {
                $('body').removeClass('single').addClass('index');                
            }
        });*/

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
                TweenMax.to(window, 0.5, {scrollTo:{y:0}, ease:Power2.easeOut});
            }        
        }        

}]);


/*
app.animation('.post-view', [function() {
  
  return {
    enter: function(element, doneFn) {
        TweenMax.fromTo(".single .post-view", 1, {opacity: 0, display: 'none'}, {opacity: 1, display: 'block', onComplete: doneFn});
       //TweenMax.fromTo(".index .post-view", 0.5, {opacity: 1, display: 'block'}, {opacity: 0, display: 'none', onComplete: doneFn});         
        console.log("enter");          
    }
  }
}]);

*/

/*
app.animation('.post-view', [function() {
  return {
    enter: function(element, doneFn, stateStatusService) {
        TweenMax.fromTo(".post-view", 1.5, {opacity: 0, display: 'none'}, {opacity: 1, display: 'block', onComplete: doneFn}); 
        console.log("enter");
    }
  }
}]);
*/
/*
app.animation('.index', [function() {
  return {
    enter: function(element, doneFn) {
        TweenMax.fromTo(".post-view", 1.5, {opacity: 1, display: 'block'}, {opacity: 0, display: 'none', onComplete: doneFn}); 
        console.log("enter");          
    }
  }
}]);
*/
/*
app.animation('.post-view', [function() {
  return {
    enter: function(element, doneFn, stateStatusService) {
        TweenMax.to(".single.post-view", 4, {opacity: 1, display: 'block', onComplete: doneFn}); 
        console.log("enter");            
    },
    enter: function(element, doneFn, stateStatusService) {
        TweenMax.to(".index.post-view", 4, {opacity: 0, display: 'none', onComplete: doneFn}); 
        console.log("enter");            
    }    
  }
}]);
*/

///////////
// Det är ju flera app.run i denna fil! SLÅ SAMMAN!

app.run(function($rootScope, $state, $location, stateStatusService) {

    //var siteTitleSplitText = new SplitText(".site-title", {type: "chars", position: "absolute", charsClass: "character"});
    //console.log (siteTitleSplitText.chars);    
    //var siteTitleTimeline = new TimelineMax();

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
        if (toState.name == 'index') {
            document.querySelector('title').innerHTML = 'Johan Bisse Mattsson';
            var content = document.getElementById('content'); // Flytta till load            
            var contentRectangle = content.getBoundingClientRect(); // Kopiera till skärmandring
            TweenMax.to(".site-title", 1, {x: contentRectangle.left, y: 12, ease: Elastic.easeOut});
            //TweenMax.staggerTo(siteTitleSplitText.chars, 1, {x: 0, y: 0, ease: Elastic.easeOut}, 0.005);
            //siteTitleTimeline.to(".site-title", 1, {left:100}).to(".site-title", 1, {top:50}).to(".site-title", 1, {opacity:0.1});
            //TweenMax.to("article", 1, {backgroundColor: "#ffccff"});


        } else if (toState.name == 'post') {
            TweenMax.to(".site-title", 1, {color:"#00ff00"});
            TweenMax.to(".site-title", 1, {x: 0, y: -32, ease: Elastic.easeOut});
            //TweenMax.to("article", 1, {backgroundColor: "#ffccff"});


            //TweenMax.staggerTo(siteTitleSplitText.chars, 1, {x: 0, y: 0, ease: Elastic.easeOut}, 0.005);
            //siteTitleTimeline.to(".site-title", 1, {left:0}).to(".site-title", 1, {top:0}).to(".site-title", 1, {opacity:1});


        }
    });
/*
    $rootScope.$on('$viewContentLoaded',function(event, viewConfig){
        if(stateStatusService.fadeOutPostView() == true) {
            stateStatusService.fadeOutPostView(false);

            console.log("hola que tal");
        }
    });
*/
   // $rootScope.$on('$viewContentLoaded',function(event, viewConfig){
     //   if(stateStatusService.postViewReadyForAnimation() == true) {
       //     console.log("JGOENOGNEO");
        //};
        /*if($state.current.name == "index") {
            if (hasAnimatedIndex != true) {
                hasAnimatedIndex = true;
            } else {

                console.log("har redan animareat index");
            }
        } else {
            if (hasAnimatedPost != true) {
                console.log("har redan aaqa post ");
                hasAnimatedPost = true;
            } else {
                console.log("har redan animareat post ");
            }
        };*/
       // TweenMax.fromTo(".post-view article", 0.5, {backgroundColor: "rgba(255,255,255,0)"}, {backgroundColor: "rgba(255,255,255,1)"});
   // });

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
});

app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $urlMatcherFactoryProvider, stateStatusService) {
    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('index', {
        url: '/',
        sticky: true,
        resolve: {
            indexTemplateCache: function ($templateRequest, stateStatusService) {                
                return $templateRequest('indexview.html');
            },
            promiseObj: function ($stateParams, resourceCache, stateStatusService, wpService) {
                if (!stateStatusService.indexInitialized()) {
                    stateStatusService.dataFromJSON(true);                    
                    stateStatusService.indexInitialized(true);                                        
                    return wpService.getIndex();
                    return wpService;                                    
                };
                return;
            }         
        },
        views: {
            'indexView@': {
                templateProvider: function(indexTemplateCache, stateStatusService) {
                    return indexTemplateCache;
                },
                controller: 'IndexController'           
            },

        }
    })
    .state('index.animationFinished', {
        views: {
            'postView@': {
                template: '</ui-view>'
            }
        }
    })           

    .state('post', {
        url: '/:slug/',
        sticky: true,
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
app.animation('.post-view', [function() {
  return {
    enter: function(element, doneFn) {
            //TweenMax.to(".post-view article", 0.5, {backgroundColor: "#bbccdd"});
            TweenMax.fromTo(".post-view article", 0.5, {backgroundColor: "rgba(255,255,255,0)"}, {backgroundColor: "rgba(255,255,255,1)"});
            console.log("enter");
            console.log($scope);          
    }
  }
}]);*/

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

/*
// 1.4+
ngModule.controller('MyController', ['$animate', function($animate){
  $animate.on('enter', ngViewElement, function() {
    // the page is ready!
  });
}])
*/
/*
app.animation(".post-view", function() {
    return {
        enter: function (element, done) {
            $('body').removeClass('single').addClass('index');
        }
    }
});
*/

app.controller('IndexController', ['$scope', 'promiseObj', '$state', '$timeout', '$anchorScroll', 'stateStatusService', function($scope, promiseObj, $state, $timeout, $anchorScroll, stateStatusService) {
    if(promiseObj) {
        $scope.data = promiseObj;       
    };

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
        if (fromState.name == "post" && toState.name == "index") {
            var tlFadeoutPost = new TimelineMax({onStart: onFadeoutStart, onComplete: onFadeoutComplete});
            tlFadeoutPost.set(".post-view article", {overflow: "hidden"});         
            tlFadeoutPost.set("body", {className: "index"}); 
            tlFadeoutPost.set(".post-view article", {backgroundColor: "rgba(255,255,255, 0)"});         

            tlFadeoutPost.to(".post-view article", 0.33, {autoAlpha: 0});
        }
    });

    $scope.isSelected = function(postitem) {
        return $scope.selected === postitem;
    }    

    $scope.onPostItemClick = function(postitem) {
        $scope.selected = postitem;        
        console.log("Postitem: " + postitem);
    }

    function onFadeoutStart(event) {

    }

    function onFadeoutComplete(event) {
        $state.go("index.animationFinished");

    }

}]);

app.controller('PostController', ['$scope', 'promiseObj', '$state', 'stateStatusService', function($scope, promiseObj, $state, stateStatusService) {
    if(promiseObj) {
        $scope.data = promiseObj;       
    }

    console.log($state.current);

    if (stateStatusService.startState() == "post") {
        console.log("hej");
    }

    $scope.$on('$viewContentLoaded', function(event) {
        var tlFadeinPost = new TimelineMax({onStart: onFadeinStart, onComplete: onFadeinComplete});
        tlFadeinPost.set(".featured-image, .entry-header, .entry-content", {autoAlpha: 0.25});


        // Tänk på att index inte alltid finns - därför kan den vara undefied
        console.log("hola: " + stateStatusService.startState());
        var postOriginalThumbnail = ".attachment-" + "avstandets-bla" + "-thumbnail";

        var postThumbnail = {
            src: $(postOriginalThumbnail).attr('src'),
            x: 3,
            y: 3,
            width: 3,
            height: 3,

        }

        console.log(postThumbnail);
        tlFadeinPost.fromTo(".post-view article", 0.33,{backgroundColor: "rgba(255,255,255, 0)"}, {backgroundColor: "rgba(255,255,255, 1)"});
    });     

   

    function onFadeinStart(event) {
        TweenMax.set(".post-view article", {overflow: "auto"});
        TweenMax.set("body", {className: "single"});
    }

    function onFadeinComplete(event) {

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
    var stringCurrentState;
    var boolDataFromJSON = false;
    var boolIndexLoaded = false;
    var boolSaveScroll = true;    
    var intScrollPos = 0;
    var boolStringInitialized = false;
    var varrenameThis = 0;
    var boolfadeOutPostView = false;

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
        },
        currentState: function (value) {
            if (value) {
                stringCurrentState = value;
                return;
            } else {
                return stringCurrentState;
            }
        },
        fadeOutPostView: function (value) {
            if (value) {
                boolfadeOutPostView = value;
                return;
            } else {
                return boolfadeOutPostView;
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