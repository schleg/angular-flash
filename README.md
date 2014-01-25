## Angular Flash

### Installation

1. Install with bower.
2. Include the `ngFlash` module:

   ```javascript
   angular.module('app', ['ng', 'ngFlash']);
   ```
3. Add the `flashMessages` directive to your html where you want flash messages
   to appear:

   ```html
   <div flash-messages></div>
   ```

### Usage

The `ngFlash` module exposes a `$flash` to display flash messages. Here's some
examples:

**Simple flash message**

```javascript
$flash('Hello World');
```

**Flash message with a custom type**

```javascript
$flash('Hello World', { type: 'info' });
```

**Flash message that persists across a route change**

```javascript
$flash('Hello World', { persist: 1 });
```

**Flash message with a custom duration**

```javascript
$flash('Hello World', { duration: 10000 });
```

### Configuration

**routeChangeSuccess**

Flash messages will, by default, disappear after the user navigates
(`$routeChangeSuccess`). If you're using angular-ui-router, then you should set
the event to `$stateChangeSuccess`:

```javascript
app.config(function(flashProvider) {
  $flashProvider.setRouteChangeSuccess('$stateChangeSuccess');
});
```
