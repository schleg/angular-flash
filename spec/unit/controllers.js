describe('FlashMessagesCtrl', function() {

  beforeEach(module('ngFlash'));

  beforeEach(inject(function($rootScope, $controller) {
    $controller('FlashMessagesCtrl', {
      $scope: $rootScope
    });
  }));

  describe('$scope.$close', function() {
    it('removes the flash message', inject(function($flash, $rootScope) {
      var flashMessage = $flash('Hello World');

      expect($flash.messages).to.not.be.empty;
      $rootScope.$close(flashMessage);
      expect($flash.messages).to.be.empty;
    }));
  });
});
