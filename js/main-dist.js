var app=angular.module("app",["ui.router","ngSanitize","ngAnimate","angular-images-loaded"]).controller("MainController");app.directive("indexView",["$templateCache",function($templateCache){return{restrict:"A",compile:function(element){$templateCache.put("indexview-initialcontent.html",element.html())}}}]),app.directive("postView",["$templateCache",function($templateCache){return{restrict:"A",compile:function(element){$templateCache.put("postview-initialcontent.html",element.html())}}}]),app.directive("preloadResource",["resourceCache",function(resourceCache){return{link:function(scope,element,attrs){resourceCache.put(attrs.preloadResource,element.html())}}}]),app.directive("onLastRepeat",function(){return function(scope,element,attrs){scope.$last&&setTimeout(function(){scope.$emit("onRepeatLast",element,attrs)},1)}}),app.run(function($templateCache,$http,resourceCache){$templateCache.put("indexview.html",'<div class="site-description" ng-bind-html="data.home.content"></div><div class="grid effect" images-loaded="imgLoadedEvents"><div class="grid-sizer"></div><div class="gutter-sizer"></div><div class="grid-item" ng-repeat="postitem in data.posts" on-last-repeat><a href="{{postitem.link}}" rel="bookmark"><img ng-src="{{postitem.featured_image.source}}" width="{{postitem.featured_image.attachment_meta.width}}" height="{{postitem.featured_image.attachment_meta.height}}" alt="{{postitem.title}}"><h1 class="entry-title">{{postitem.title}}</h1><div class="entry-details">{{postitem.acf.entry_details}}</div></a></div>'),$templateCache.put("postview.html",'<article id="post-{{data.post.ID}}" class="post-{{data.post.ID}} {{data.post.type}} type-{{data.post.type}}"><header class="entry-header"><h1 class="entry-title">{{data.post.title}}</h1><div class="entry-details">{{data.post.acf.entry_details}}</div></header><div class="entry-content" ng-bind-html="data.post.content"></div></article>'),$http.get("wp-content/uploads/json/sitedata.json",{cache:resourceCache})}),app.controller("MainController",["$scope","$rootScope","$state","$location","$timeout","$anchorScroll","stateStatusService",function($scope,$rootScope,$state,$location,$timeout,$anchorScroll,stateStatusService){$rootScope.$on("$stateChangeStart",function(event,toState){stateStatusService.startState()||("index"==toState.name&&stateStatusService.indexInitialized(!0),stateStatusService.startState(toState.name),console.log("Start state is... "+stateStatusService.startState())),"index"==toState.name&&(event.preventDefault(),stateStatusService.indexInitialized()?(stateStatusService.dataFromJSON(!0),$state.go("index.load")):(stateStatusService.dataFromJSON(!0),$state.go("index.init")))}),$rootScope.$on("$stateChangeSuccess",function(event,toState){"post"==toState.name?$("body").removeClass("index").addClass("post"):$("body").removeClass("post").addClass("index")}),$scope.imgLoadedEvents={always:function(){},done:function(instance){angular.element(instance.elements[0]).addClass("loaded");new Isotope(".grid",{percentPosition:"true",itemSelector:".grid-item",layoutMode:"masonry",transitionDuration:"0",masonry:{columnWidth:".grid-sizer",gutter:".gutter-sizer"}})},fail:function(){}},$scope.gotoTop=function(){$scope.currentPath=$location.path(),"/"==$scope.currentPath&&(stateStatusService.scrollPos(0),$("html,body").animate({scrollTop:0},500))}}]),app.config(function($stateProvider,$urlRouterProvider,$locationProvider){$locationProvider.html5Mode(!0),$urlRouterProvider.otherwise("/"),$stateProvider.state("index",{url:"/"}).state("index.load",{resolve:{tempIndexLoadResolveFunction:function(){console.log("Index Load funkar!!!!!!! snurra uppe till vänster!")}}}).state("index.init",{resolve:{indexTemplateCacheOrInitialContent:function($templateRequest,stateStatusService){return stateStatusService.dataFromJSON()?(console.log("get indexview.html (json)"),$templateRequest("indexview.html")):(console.log("get initialcontent.html (php)"),$templateRequest("indexview-initialcontent.html"))},promiseObj:function($stateParams,resourceCache,stateStatusService,wpService){return stateStatusService.dataFromJSON()?(console.log("hej"),wpService.getIndex()):(console.log("Set data from json true"),console.log("2"),stateStatusService.dataFromJSON(!0),stateStatusService.indexInitialized(!0),void 0)}},views:{"indexView@":{templateProvider:function(indexTemplateCacheOrInitialContent){return indexTemplateCacheOrInitialContent},controller:"IndexController"}}}).state("post",{url:"/:slug/",resolve:{postTemplateCacheOrInitialContent:function($templateRequest,stateStatusService){return stateStatusService.dataFromJSON()?(console.log("get postview.html (json)"),$templateRequest("postview.html")):(console.log("get initialcontent.html (php)"),$templateRequest("postview-initialcontent.html"))},promiseObj:function($stateParams,resourceCache,stateStatusService,wpService){return stateStatusService.dataFromJSON()?wpService.getPost($stateParams.slug):(console.log("initDataFromJSON (post state)"),console.log("3"),stateStatusService.dataFromJSON(!0),void 0)}},views:{"postView@":{templateProvider:function(postTemplateCacheOrInitialContent){return postTemplateCacheOrInitialContent},controller:"PostController"}}})}),app.controller("IndexController",["$scope","promiseObj","$timeout","$anchorScroll","stateStatusService",function($scope,promiseObj){promiseObj&&($scope.data=promiseObj)}]),app.controller("PostController",["$scope","promiseObj",function($scope,promiseObj){promiseObj&&($scope.data=promiseObj)}]),app.factory("resourceCache",["$cacheFactory",function($cacheFactory){return $cacheFactory("resourceCache")}]),app.factory("wpService",["$http","$q","$stateParams","resourceCache",function($http,$q,$stateParams,resourceCache){var wpService={post:[],posts:[],pages:[],home:[]};return wpService.getIndex=function(){return $http.get("wp-content/uploads/json/sitedata.json",{cache:resourceCache}).success(function(resindex){angular.forEach(resindex,function(postvalue,postkey){"Home"==resindex[postkey].title?(wpService.home=resindex[postkey],document.querySelector("title").innerHTML="Johan Bisse Mattsson"):resindex[postkey].slug==$stateParams.slug&&(wpService.posts=resindex[postkey])});for(var i=resindex.length-1;i>=0;i--)"post"!=resindex[i].type&&resindex.splice(i,1);wpService.posts=resindex}).then(function(){return wpService})},wpService.getPost=function(slug){return $http.get("wp-content/uploads/json/sitedata.json",{cache:resourceCache}).success(function(respost){angular.forEach(respost,function(postvalue,postkey){respost[postkey].slug==slug&&(wpService.post=respost[postkey],document.querySelector("title").innerHTML=respost[postkey].title+" | Johan Bisse Mattsson")})}).then(function(){return wpService})},wpService}]),app.service("stateStatusService",function(){var stringStartState,boolDataFromJSON=!1,boolIndexLoaded=!1,boolSaveScroll=!0,intScrollPos=0,boolStringInitialized=!1,varrenameThis=0;return{startState:function(value){return value?void(stringStartState=value):stringStartState},dataFromJSON:function(value){return value?void(boolDataFromJSON=value):boolDataFromJSON},indexLoaded:function(value){return value?void(boolIndexLoaded=value):boolIndexLoaded},saveScroll:function(value){return value?void(boolSaveScroll=value):boolSaveScroll},scrollPos:function(value){return value?void(intScrollPos=value):intScrollPos},indexInitialized:function(value){return value?void(boolStringInitialized=value):boolStringInitialized},renameThis:function(value){return value?void(varrenameThis=value):varrenameThis}}});
