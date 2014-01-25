/*! angular-flash - v0.0.1 - 2014-01-24 */(function (angular) {
  'use strict';
  var templateUrl = 'template/flash-messages.html';
  var after = function (times, func) {
    return function () {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };
  var module = angular.module('ngFlash', ['ng']);
  module.provider('$flash', function () {
    var defaultDuration = 5000;
    this.setDefaultDuration = function (duration) {
      defaultDuration = duration;
    };
    var defaultType = 'alert';
    this.setDefaultType = function (type) {
      defaultType = type;
    };
    var routeChangeSuccess = '$routeChangeSuccess';
    this.setRouteChangeSuccess = function (event) {
      routeChangeSuccess = event;
    };
    this.$get = [
      '$rootScope',
      '$timeout',
      function ($rootScope, $timeout) {
        var flash;
        function FlashMessage(message, options) {
          options = options || {};
          this.message = message;
          this.duration = options.duration || defaultDuration;
          this.type = options.type || defaultType;
          this.persist = options.persist;
        }
        ;
        FlashMessage.prototype.remove = function () {
          flash.messages.splice(flash.messages.indexOf(this), 1);
        };
        FlashMessage.prototype.init = function () {
          this.timeout = $timeout(this.remove, this.duration);
          if (this.persist) {
            $rootScope.$on(routeChangeSuccess, after(this.persist + 1, this.remove));
          } else {
            $rootScope.$on(routeChangeSuccess, this.remove);
          }
          return this;
        };
        flash = function (message, options) {
          var flashMessage = new FlashMessage(message, options);
          flash.messages.push(flashMessage.init());
          return flashMessage;
        };
        flash.messages = [];
        flash.remove = function (message) {
          message.remove();
        };
        flash.reset = function () {
          flash.messages.length = 0;
        };
        return flash;
      }
    ];
  });
  module.controller('FlashMessagesCtrl', [
    '$scope',
    '$flash',
    function ($scope, $flash) {
      $scope.messages = $flash.messages;
      $scope.$close = function (message) {
        $flash.remove(message);
      };
    }
  ]);
  module.directive('flashMessages', function () {
    return {
      restrict: 'EA',
      replace: true,
      scope: {},
      templateUrl: templateUrl,
      controller: 'FlashMessagesCtrl'
    };
  });
  module.run([
    '$templateCache',
    function ($templateCache) {
      if (!$templateCache.get(templateUrl)) {
        $templateCache.put(templateUrl, '<div class="flash-messages">' + '<div class="flash-message {{message.type}}" ng-repeat="message in messages" ng-bind="message.message">' + '<a href="" class="close" ng-click="$close(message)"></a>' + '</div>' + '</div>');
      }
    }
  ]);
}(angular));