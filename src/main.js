'use strict';

import { createApp } from 'vue';
import App from './App.vue';
import ClickOutside from './components/utilities/СlickOutside.js'
const app = createApp(App);

app.directive('click-outside', ClickOutside);

document.addEventListener('DOMContentLoaded', () =>
{
    app.mount('#app');
});
