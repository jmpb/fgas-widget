# FFD FGAS Zoho Inventory Widget

A widget to allow users of Zoho Inventory to quickly and effectively record FGAS data for Sales orders.

## Build

### Requirements

- [NPM (Node Package Manager)/Node.js](https://nodejs.org/en/download/)
- [ZET (Zoho Extension Toolkit)](https://www.npmjs.com/package/zoho-extension-toolkit)

### [AlpineJS](https://alpinejs.dev/)

A lightweight JS library very useful for making quick effects.

Added via CDN in `app/widget.html`.

### [Tailwind](https://tailwindcss.com/)

Tailwind allows quick use of styles, input is taken from CSS, HTML and JS files in the `app` folder as defined in the `tailwind.config.js` file. When the CSS is compiled, it will build the Tailwind relevant classes that are used and output them to the `app/css/fgas.css` file.

Tailwind build command:

```cli
npx tailwindcss -i ./app/css/styles.css -o ./app/css/fgas.css --watch
``````