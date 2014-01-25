describe('flashMessages', function() {
  var elem, scope, flash;

  beforeEach(module('ngFlash'));

  beforeEach(inject(function($rootScope, $compile, $flash) {
    elem = angular.element('<div flash-messages></div>');
    scope = $rootScope.$new();

    $compile(elem)(scope);
    scope.$digest();

    flash = function() {
      $flash.apply($flash, arguments);
      scope.$digest();
    };
  }));

  it('is empty by default', function() {
    expect(elem).to.be.empty;
  });

  it('displays flash messages when added', function() {
    flash('Hello World');

    expect(elem.find('.alert')).to.have.text('Hello World');
  });

  it('hides the flash messages', inject(function($timeout) {
    flash('Hello World');
    $timeout.flush();

    expect(elem.find('.alert')).to.not.exist;
  }));

  it('adds the appropriate class', function() {
    flash('Hello World', { type: 'info' });
    expect(elem.find('.info')).to.exist;
  });
});
