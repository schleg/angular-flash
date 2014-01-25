describe('$flash', function() {
  var clock;

  beforeEach(module('ngFlash'));

  it('adds messages', inject(function($flash) {
    $flash('Hello World');

    expect($flash.messages[0].message).to.eq('Hello World');
  }));

  it('removes messages after the timeout', inject(function($flash, $timeout) {
    $flash('Hello World');

    $timeout.flush();
    expect($flash.messages).to.be.empty;
  }));

  it('cancels the timeout when the message is added twice', inject(function($flash, $timeout) {
    var message = 'Hello World';

    $flash(message);
    $flash(message);
  }));

  it('removes the flash message on route change events', inject(function($rootScope, $flash) {
    $flash('Hello World');

    $rootScope.$emit('$routeChangeSuccess');

    expect($flash.messages).to.be.empty;
  }));

  it('allows messages to persist across route change events', inject(function($rootScope, $flash, $timeout) {
    $flash('Hello World', { persist: 1 });

    $rootScope.$emit('$routeChangeSuccess');
    expect($flash.messages.length).to.eq(1);
  }));

  describe('FlashMessage', function() {
    var flashMessage;

    beforeEach(inject(function($flash) {
      flashMessage = $flash('Hello World');
    }));

    describe('#remove', function() {
      it('removes the message', inject(function($flash) {
        flashMessage.remove();

        expect($flash.messages).to.be.empty;
      }));
    });
  });

  describe('.reset', function() {
    it('resets the messages', inject(function($flash) {
      $flash('Hello World');

      $flash.reset();
      expect($flash.messages).to.be.empty;
    }));
  });
});
