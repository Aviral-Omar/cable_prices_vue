<template>
  <section id="channel-lists">
    <h2 v-if="isLoading">Loading...</h2>
    <h2 v-else-if="providers.length === 0">No providers!</h2>
    <channel-list
      v-for="provider of providers"
      v-else
      :key="provider._id"
      :channels="getChannels(provider._id)"
      :provider="provider"
      @selection-changed="changeSelection"
    >
    </channel-list>
  </section>
  <price-card :channels="channels" :bouquets="bouquets"></price-card>
</template>

<script>
import ChannelList from './components/channel_list.vue';
import PriceCard from './components/price_card.vue';

export default {
  name: 'App',
  components: [ChannelList, PriceCard],
  data() {
    return {
      isLoading: false,
      providers: [],
      channels: {},
      bouquets: {},
    };
  },
  created() {
    this.isLoading = true;
    this.getData();
  },
  methods: {
    async getData() {
      try {
        this.providers = await (await fetch('http://localhost:3000/providers')).json();
        const chList = await (await fetch('http://localhost:3000/channels')).json();
        chList.forEach(channel => {
          if (!this.channels[channel.provider]) {
            this.channels[channel.provider] = [];
          }
          this.channels[channel.provider].push({
            ...channel,
            isChecked: false,
          });
        });
        const bqList = await (await fetch('http://localhost:3000/bouquets')).json();
        bqList.forEach(bouquet => {
          bouquet.channelCount = 0;
          bouquet.channels.forEach(channel => {
            chList.forEach(ch => {
              if (ch._id === channel) {
                bouquet.channelCount += ch.quality === 'HD' ? 2 : 1;
              }
            });
          });
          if (!this.bouquets[bouquet.provider]) {
            this.bouquets[bouquet.provider] = [];
          }
          this.bouquets[bouquet.provider].push(bouquet);
        });
      } catch (err) {
        console.log(err);
      }
      this.isLoading = false;
    },
    getChannels(provider) {
      return Object.keys(this.channels).length === 0 ? [] : this.channels[provider];
    },
    changeSelection(channel) {
      channel.isChecked = !channel.isChecked;
    },
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: sans-serif;
  box-sizing: border-box;
}

#channel-lists {
  display: flex;
  width: 100%;
  flex-flow: row wrap;
  justify-content: center;
  overflow: scroll;
  align-items: stretch;
}

.card {
  border-radius: 1rem;
  margin: 1rem;
  padding: 1rem;
  box-shadow: 0 4px 8px 0 grey;
  flex-grow: 1;
}

.card h3,
.card h2 {
  margin: 0;
}

.card ul {
  list-style: none;
  padding: 0;
}
</style>
