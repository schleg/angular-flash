(function(angular) {
  'use strict';

  var templateUrl = 'template/flash-messages.html';

  var module = angular.module('ngFlash', ['ng']);

  module.provider('$flash', function() {
    // How long to wait before removing the flash message.
    var defaultDuration = 5000;
    this.setDefaultDuration = function(duration) {
      defaultDuration = duration;
    };

    // The type of message.
    var defaultType = 'alert';
    this.setDefaultType = function(type) {
      defaultType = type;
    };

    // Flash messages will not persist across route change events unless
    // explicitly specified.
    var routeChangeSuccess = '$routeChangeSuccess';
    this.setRouteChangeSuccess = function(event) {
      routeChangeSuccess = event;
    };

    this.$get = function($rootScope, $timeout) {
      var flash;

      /**
       * Flash that represents a flash message.
       */
      function FlashMessage(message, options) {
        options = options || {};

        this.message  = message
        this.duration = options.duration || defaultDuration;
        this.type     = options.type || defaultType;
        this.persist  = options.persist;
      };

      /**
       * Remove this flash message.
       */
      FlashMessage.prototype.remove = function() {
        flash.messages.splice(flash.messages.indexOf(this), 1);
      };

      /**
       * Starts the timeout to remove this message. Cancels the existing
       * timeout if it's present.
       */
      FlashMessage.prototype.startTimeout = function() {
        if (this.timeout) {
          $timeout.cancel(this.timeout);
        }

        this.timeout = $timeout(this.remove, this.duration);

        return this.timeout;
      };

      /**
       * Initialize timeouts.
       */
      FlashMessage.prototype.init = function() {
        this.startTimeout();

        // Remove the flash message when the user navigates.
        if (this.persist) {
          var _this = this;

          /**
           * Only runs `func` after the function has been executed `times` times. Each time that `func` is not run,
           * it will restart the timeout to remove this message.
           *
           * See
           * https://github.com/jashkenas/underscore/blob/2c709d72c89a1ae9e06c56fc256c14435bfa7893/underscore.js#L770
           */
          var after = function(times, func) {
            return function() {
              if (--times < 1) {
                return func.apply(this, arguments);
              } else {
                _this.startTimeout();
              }
            };
          };

          $rootScope.$on(routeChangeSuccess, after(this.persist + 1, this.remove));
        } else {
          $rootScope.$on(routeChangeSuccess, this.remove);
        }

        return this;
      };

      /**
       * Add a flash message.
       *
       * @param {String} message - The flash message to display.
       *
       * @return {Object} The flash message that was added.
       */
      flash = function(message, options) {
        var flashMessage = new FlashMessage(message, options);
        flash.messages.push(flashMessage.init());
        return flashMessage;
      };

      // Where we store flash messages.
      flash.messages = []

      /**
       * Reset the flash messages
       */
      flash.reset = function() {
        flash.messages.length = 0;
      };

      return flash;
    };
  });

  module.directive('flashMessages', function() {
    return {
      restrict: 'EA',
      replace: true,
      scope: {},
      templateUrl: templateUrl,
      controller: function($scope, $flash) {
        $scope.messages = $flash.messages;
      }
    };
  });

  module.run(function($templateCache) {
    if (!$templateCache.get(templateUrl)) {
      $templateCache.put(templateUrl,
        '<div class="flash-messages">' +
          '<div class="flash-message {{message.type}}" ng-repeat="message in messages" ng-bind="message.message">' +
            '<a href="" class="close" ng-click="message.remove()"></a>' +
          '</div>' +
        '</div>');
    }
  });

})(angular);
