//
// Shim file to prevent 404 errors when a hosting environment or wrapper
// attempts to load /bundle.js. Create React App (CRA) serves compiled assets
// under /static/js/*.js and does not generate a top-level bundle.js file.
//
// This file is intentionally minimal and has no side effects.
//
// If you are seeing this message, your environment is likely configured to
// look for /bundle.js due to legacy defaults. The application itself does not
// rely on this file.
//
(() => {
  try {
    // eslint-disable-next-line no-console
    console.info(
      "bundle.js shim loaded. Note: CRA uses /static/js/*.js, not /bundle.js."
    );
  } catch (_) {
    /* noop */
  }
})();
