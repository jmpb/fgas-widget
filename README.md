# FFD FGAS Zoho Inventory Widget

A widget to allow users of Zoho Inventory to quickly and effectively record FGAS data for Sales orders.

## Build

### Requirements

- [NPM (Node Package Manager)/Node.js](https://nodejs.org/en/download/)

### [ZET (Zoho Extension Toolkit)](https://www.npmjs.com/package/zoho-extension-toolkit)

To run the widget in a local browser window use: 

```cli
zet run
```

This will show the basic HTML and CSS but most of the JS that fetches data will not work as it depends on Zoho specific functionality.

Once finished making changes you can pack the widget into a distributable by running:

```cli
zet pack
```

This will output to `dist/FGAS_Widget.zip` which can be uploaded into Inventory.

### [AlpineJS](https://alpinejs.dev/)

A lightweight JS library very useful for making quick effects.

Added via CDN in `app/widget.html`.

### [Tailwind](https://tailwindcss.com/)

Tailwind allows quick use of styles, input is taken from CSS, HTML and JS files in the `app` folder as defined in the `tailwind.config.js` file. When the CSS is compiled, it will build the Tailwind relevant classes that are used and output them to the `app/css/fgas.css` file.

During development, run this command so Node watches and rebuilds the changes to styles on save:

```cli
npx tailwindcss -i ./app/css/styles.css -o ./app/css/fgas.css --watch
``````