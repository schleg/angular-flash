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
    var defaultTimeout = 5000;

    // The type of message.
    var defaultType = 'alert';

    // Flash messages will not persist across route change events unless
    // explicitly specified.
    var routeChangeSuccess = '$routeChangeSuccess';

    this.$get = function($rootScope, $timeout) {
      var flash;

      /**
       * Add a flash message.
       *
       * @param {String} message - The flash message to display.
       *
       * @return {Object} The flash message that was added.
       */
      flash = function(message, options) {
        var flashMessage = flash.add(message, options);

        var remove = function() {
          flash.remove(flashMessage);
        };

        // Remove the flash message after the specified timeout.
        flashMessage.promise = $timeout(remove, flashMessage.timeout);

        // Remove the flash message when the user navigates.
        if (flashMessage.persist) {
          $rootScope.$on(routeChangeSuccess, after(flashMessage.persist + 1, remove));
        } else {
          $rootScope.$on(routeChangeSuccess, remove);
        }

        return flashMessage;
      };

      // Where we store flash messages.
      flash.messages = []

      /**
       * Add a flash message.
       *
       * @param {String} message - The message message.
       * @param {Object} options - A hash of options.
       */
      flash.add = function(message, options) {
        options = options || {};

        var defaults = {
          timeout: defaultTimeout,
          type: defaultType
        };

        var flashMessage = angular.extend({ message: message }, defaults, options);

        flash.messages.push(flashMessage);

        return flashMessage;
      };

      /**
       * Remove a message from the collection of flash messages.
       *
       * @param {Object} message - The flash message to remove.
       */
      flash.remove = function(message) {
        flash.messages.splice(flash.messages.indexOf(message), 1);
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
