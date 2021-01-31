<template>
  <section class="card" id="price-card">
    <h3>Price: {{ price.toFixed(2) }}</h3>
    <h3>Number of Channels: {{ channelCount }}</h3>
    <section class="detail-section">
      <div>
        <h4>Bouquets</h4>
        <ul>
          <li v-for="bouquet of selectedBouquets" :key="bouquet._id">{{ bouquet.name }} (₹{{ bouquet.price }})</li>
        </ul>
      </div>
      <div>
        <h4>A la carte Channels</h4>
        <ul>
          <li v-for="channel of alcChannels" :key="channel._id">{{ channel.name }} (₹{{ channel.alcPrice }})</li>
        </ul>
      </div>
    </section>
  </section>
</template>

<script>
export default {
  props: ['channels', 'bouquets'],
  data() {
    return {
      price: 0,
      channelCount: 0,
      checkedChannels: {},
      selectedBouquets: [],
      alcChannels: [],
    };
  },
  methods: {
    calculatePrice() {
      this.price = 0;
      this.selectedBouquets = [];
      this.alcChannels = [];
      this.channelCount = 0;
      Object.entries(this.channels).forEach(channelSet => {
        this.checkedChannels[channelSet[0]] = channelSet[1].filter(channel => channel.isChecked);
      });
      Object.entries(this.bouquets).forEach(bouquetSet => {
        console.log(bouquetSet[0]);
        while (this.checkedChannels[bouquetSet[0]].length !== 0) {
          this.calcBouquetInfo(bouquetSet);
          let bouquetUsed = false;
          for (let i = 0; i < bouquetSet[1].length; i++) {
            if (bouquetSet[1][i].price < bouquetSet[1][i].matchingPrice) {
              bouquetSet[1][i].channels.forEach(channelId => {
                this.checkedChannels[bouquetSet[0]] = this.checkedChannels[bouquetSet[0]].filter(channel => {
                  return channel._id !== channelId && channel.HdCounterpart !== channelId;
                });
              });
              this.price += bouquetSet[1][i].price;
              this.channelCount += bouquetSet[1][i].channelCount;
              this.selectedBouquets.push(bouquetSet[1][i]);
              bouquetUsed = true;
              break;
            }
          }
          if (!bouquetUsed) {
            this.checkedChannels[bouquetSet[0]].forEach(channel => {
              this.price += channel.alcPrice;
              this.channelCount += channel.quality === 'HD' ? 2 : 1;
              this.alcChannels.push(channel);
            });
            this.checkedChannels[bouquetSet[0]] = [];
          }
        }
      });
      this.price += this.channelCount < 200 ? 130 : 160;
      this.price *= 1.18;
    },
    calcBouquetInfo(bouquetSet) {
      bouquetSet[1].forEach(bouquet => {
        bouquet.matching = 0;
        bouquet.matchingPrice = 0;
        bouquet.channels.forEach(channelId => {
          this.checkedChannels[bouquetSet[0]].forEach(channel => {
            if (channel._id === channelId) {
              bouquet.matching++;
              bouquet.matchingPrice += channel.alcPrice;
            } else if (channel.HdCounterpart === channelId) {
              const HdCounterpart = this.channels[bouquetSet[0]].find(ch => ch._id === channelId);
              bouquet.matching++;
              bouquet.matchingPrice += HdCounterpart.alcPrice;
            }
          });
        });
      });
      let totalAlcPrice = 0;
      this.checkedChannels[bouquetSet[0]].forEach(channel => {
        totalAlcPrice += channel.alcPrice;
      });
      bouquetSet[1].sort((b1, b2) => {
        if (totalAlcPrice - b1.matchingPrice + b1.price < totalAlcPrice - b2.matchingPrice + b2.price) {
          return -1;
        } else if (totalAlcPrice - b1.matchingPrice + b1.price === totalAlcPrice - b2.matchingPrice + b2.price) {
          if (b1.matching > b2.matching) {
            return -1;
          } else if (b1.matching === b2.matching) {
            if (b1.channels.length < b2.channels.length) {
              return -1;
            } else {
              return 1;
            }
          } else {
            return 1;
          }
        } else {
          return 1;
        }
      });
    },
  },
  watch: {
    channels: {
      deep: true,
      handler() {
        this.calculatePrice();
      },
    },
  },
};
</script>

<style>
#price-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#price-card h3 {
  margin: 0 0 1rem 0;
}

#price-card h4 {
  font-size: 120%;
  font-weight: normal;
}

.detail-section {
  display: flex;
  width: 100%;
  flex-flow: row wrap;
  justify-content: space-between;
}
</style>
