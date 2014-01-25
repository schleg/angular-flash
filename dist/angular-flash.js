/*! angular-flash - v0.0.2 - 2014-01-25 */(function (angular) {
  'use strict';
  var bind = function (fn, context) {
    return function () {
      return fn.apply(context, arguments);
    };
  };
  var templateUrl = 'template/flash-messages.html';
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
          this.cancelTimeout();
          flash.messages.splice(flash.messages.indexOf(this), 1);
        };
        FlashMessage.prototype.startTimeout = function () {
          this.cancelTimeout();
          this.timeout = $timeout(bind(this.remove, this), this.duration);
          return this.timeout;
        };
        FlashMessage.prototype.cancelTimeout = function () {
          if (this.timeout) {
            $timeout.cancel(this.timeout);
          }
        };
        FlashMessage.prototype.init = function () {
          var remove = bind(this.remove, this);
          this.startTimeout();
          if (this.persist) {
            var _this = this;
            var after = function (times, func) {
              return function () {
                if (--times < 1) {
                  return func.apply(this, arguments);
                } else {
                  _this.startTimeout();
                }
              };
            };
            $rootScope.$on(routeChangeSuccess, after(this.persist + 1, remove));
          } else {
            $rootScope.$on(routeChangeSuccess, remove);
          }
          return this;
        };
        flash = function (message, options) {
          var flashMessage = new FlashMessage(message, options);
          flash.messages.push(flashMessage.init());
          return flashMessage;
        };
        flash.messages = [];
        flash.reset = function () {
          flash.messages.length = 0;
        };
        return flash;
      }
    ];
  });
  module.directive('flashMessages', function () {
    return {
      restrict: 'EA',
      replace: true,
      scope: {},
      templateUrl: templateUrl,
      controller: [
        '$scope',
        '$flash',
        function ($scope, $flash) {
          $scope.messages = $flash.messages;
        }
      ]
    };
  });
  module.run([
    '$templateCache',
    function ($templateCache) {
      if (!$templateCache.get(templateUrl)) {
        $templateCache.put(templateUrl, '<div class="flash-messages">' + '<div class="flash-message {{message.type}}" ng-repeat="message in messages" ng-bind="message.message">' + '<a href="" class="close" ng-click="message.remove()"></a>' + '</div>' + '</div>');
      }
    }
  ]);
}(angular));