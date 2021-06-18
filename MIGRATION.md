# Migration

### Migrating from v4 to v5

Support for Bower and version 2 of the Origami Build Service have been removed.

Follow [the migration guide on the Origami website](https://origami.ft.com/docs/tutorials/bower-to-npm/).

## Migrating from v3 to v4

To support IE11 and other older browsers v4 requires the [Element.prototype.matches](https://polyfill.io/v3/url-builder/#Element.prototype.matches-polyfill) polyfill.

It also uses [ES Modules over CommonJS](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/) syntax, and updates the default export to the constructor. We recommend to include `ftdomdelegate` using the es modules syntax.

If you used the `.Delegate` constructor update your import:

```diff
-const Delegate = require('ftdomdelegate').Delegate;
+import Delegate from 'ftdomdelegate';
let myDel = new Delegate(document.body);
```

If you used the previous default export, also update to use the constructor:
```diff
-const delegate = require('ftdomdelegate');
-let myDel = delegate(document.body);
+import Delegate from 'ftdomdelegate';
+let myDel = new Delegate(document.body);
```

However to use the CommonJS syntax, without a plugin like [babel-plugin-transform-es2015-modules-commonjs](https://babeljs.io/docs/en/babel-plugin-transform-es2015-modules-commonjs), add `.default`.

```diff
-const Delegate = require('ftdomdelegate').Delegate;
+const Delegate = require('ftdomdelegate').default;
let myDel = new Delegate(document.body);
```

## Migrating from v2 to v3

V3 is a name change and does not make any API changes. Replace `dom-delegate` in your `bower.json` with `ftdomdelegate`.
