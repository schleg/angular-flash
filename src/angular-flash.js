(function(angular) {
  'use strict';

  /**
   * See
   * https://github.com/jashkenas/underscore/blob/2c709d72c89a1ae9e06c56fc256c14435bfa7893/underscore.js#L770
   */
  var after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  var module = angular.module('ngFlash', ['ng']);

  module.provider('$flash', function() {
    // How long to wait before removing the flash message.
    var defaultDuration = 5000;

    // The type of message.
    var defaultType = 'alert';

    // Flash messages will not persist across route change events unless
    // explicitly specified.
    var routeChangeSuccess = '$routeChangeSuccess';

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
       * Initialize timeouts.
       */
      FlashMessage.prototype.init = function() {
        this.timeout = $timeout(this.remove, this.duration);

        // Remove the flash message when the user navigates.
        if (this.persist) {
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
       * Remove a message from the collection of flash messages.
       *
       * @param {Object} message - The flash message to remove.
       */
      flash.remove = function(message) {
        message.remove();
      };

      /**
       * Reset the flash messages
       */
      flash.reset = function() {
        flash.messages.length = 0;
      };

      return flash;
    };
  });

  module.controller('FlashMessagesCtrl', function($scope, $flash) {
    $scope.messages = $flash.messages;

    /**
     * Remove a message.
     *
     * @param {Object} message - The message to remove.
     */
    $scope.$close = function(message) {
      $flash.remove(message);
    };
  });

  module.directive('flashMessages', function() {
    return {
      restrict: 'EA',
      replace: true,
      scope: {},
      templateUrl: 'template/flash-messages.html',
      controller: 'FlashMessagesCtrl'
    };
  });

  module.run(function($templateCache) {
    $templateCache.put('template/flash-messages.html',
      '<div class="flash-messages">' +
        '<div class="{{message.type}}" ng-repeat="message in messages" ng-bind="message.message">' +
          '<a href="" class="close" ng-click="$close(message)"></a>' +
        '</div>' +
      '</div>');
  });

})(angular);
