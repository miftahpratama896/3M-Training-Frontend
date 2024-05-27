// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    content: ["./src/**/*.{html,js}",
        'node_modules/preline/dist/*.js',
        'node_modules/flowbite-react/lib/esm/**/*.js'
    ],
    theme: {
        extend: {},
    },
    plugins: [
        require('preline/plugin'),
        require('flowbite/plugin'),
        require('@tailwindcss/forms'),
        require('tailwindcss-animated')
    ],
};
