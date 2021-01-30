import { createApp } from 'vue';
import App from './App.vue';

import Header from './components/header.vue';
import ChannelList from './components/channel_list.vue';
import PriceCard from './components/price_card.vue';

const app = createApp(App);

app.component('app-header', Header);
app.component('channel-list', ChannelList);
app.component('price-card', PriceCard);

app.mount('#app');
