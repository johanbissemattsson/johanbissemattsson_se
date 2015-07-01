var app = angular.module('app', ['ngRoute', 'ngSanitize'])


app.directive('contentview', ['$templateCache', function($templateCache)
{
    return {
        restrict: 'A',
        compile:  function (element)
        {
            $templateCache.put('hej.html', element.html());
        }
    };
}])

app.run(function($templateCache) {
  $templateCache.put('content.html', '<article id="post-{{post.ID}}" class="post-{{post.ID}} {{post.type}} type-{{post.type}}"><header class="entry-header"><h1 class="entry-title">{{post.title}}</h1><div class="entry-details">{{post.acf.entry_details}}</div></header><div class="entry-content" ng-bind-html="post.content"></div></article>');
});

app.config(function($routeProvider, $locationProvider) {
    var initialized = false;
    $locationProvider.html5Mode(true);
 
    $routeProvider
    .when('/', {
        template: function() {
            initialized = true;
            return '';
        }
    })
    .when('/:slug/', {
        templateUrl: function(){
            if(initialized){ 
                return 'content.html';
            }

            initialized = true;

            return 'hej.html';
        },
        controller: 'Content'
    });

})

app.controller('Content', function($scope, $http, $routeParams) {
    $http.get('wp-json/posts/?filter[name]=' + $routeParams.slug).success(function(res){
        $scope.post = res[0];
        document.querySelector('title').innerHTML = res[0].title + ' | Johan Bisse Mattsson';        
    });
    
});
