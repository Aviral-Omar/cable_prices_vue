<template>
  <section class="card" id="price-card">
    <h3>Price: {{ price }}</h3>
    <button @click="calculatePrice">Calculate Price</button>
  </section>
</template>

<script>
export default {
  props: ['channels', 'bouquets'],
  data() {
    return {
      price: 0,
      checkedChannels: {},
    };
  },
  methods: {
    calculatePrice() {
      this.price = 0;
      Object.entries(this.channels).forEach(channelSet => {
        this.checkedChannels[channelSet[0]] = channelSet[1].filter(channel => channel.isChecked);
      });
      Object.entries(this.bouquets).forEach(bouquetSet => {
        while (this.checkedChannels[bouquetSet[0]].length !== 0) {
          this.calcBouquetInfo(bouquetSet);
          if (bouquetSet[1][0].price < bouquetSet[1][0].matchingPrice) {
            bouquetSet[1][0].channels.forEach(channelId => {
              this.checkedChannels[bouquetSet[0]] = this.checkedChannels[bouquetSet[0]].filter(
                channel => channel._id !== channelId,
              );
            });
            this.price += bouquetSet[1][0].price;
            console.log(bouquetSet[1][0].name);
          } else {
            this.checkedChannels[bouquetSet[0]].forEach(channel => {
              console.log(channel.name);
              this.price += channel.alcPrice;
            });
            this.checkedChannels[bouquetSet[0]] = [];
          }
        }
      });
    },
    calcBouquetInfo(bouquetSet) {
      bouquetSet[1].forEach(bouquet => {
        bouquet.matching = 0;
        bouquet.matchingPrice = 0;
        bouquet.channels.forEach(channelId => {
          this.checkedChannels[bouquetSet[0]].find(channel => {
            if (channel._id === channelId) {
              bouquet.matching++;
              bouquet.matchingPrice += channel.alcPrice;
            }
          });
        });
      });
      bouquetSet[1].sort((b1, b2) => {
        if (b1.matching > b2.matching) {
          return -1;
        } else if (b1.matching === b2.matching) {
          if (b1.matchingPrice - b1.price < b2.matchingPrice - b1.price) {
            return -1;
          } else {
            return 1;
          }
        } else {
          return 1;
        }
      });
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
  margin-bottom: 1rem;
}

button {
  background-color: cornflowerblue;
  border: 2px solid black;
  padding: 0.5rem;
  border-radius: 0.5rem;
  color: white;
}
</style>
