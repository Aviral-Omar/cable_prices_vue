<template>
  <article class="card channel-card">
    <h3 v-if="channels.length === 0">No channels!</h3>
    <div v-else>
      <h2>{{ provider.name }}</h2>
      <ul>
        <h4 v-if="hdChannels.length !== 0">HD Channels</h4>
        <li v-for="channel in hdChannels" :key="channel._id">
          <input
            type="checkbox"
            :name="channel._id"
            :id="channel._id"
            :value="channel"
            @change="$emit('selection-changed', channel)"
          />
          <label :for="channel._id">{{ channel.name }}</label>
        </li>
        <h4 v-if="sdChannels.length !== 0">SD Channels</h4>
        <li v-for="channel in sdChannels" :key="channel._id">
          <input
            type="checkbox"
            :name="channel._id"
            :id="channel._id"
            :value="channel"
            @change="$emit('selection-changed', channel)"
          />
          <label :for="channel._id"
            >{{ channel.name }}<span v-if="channel.HdCounterpart" class="small-text"> (HD available)</span></label
          >
        </li>
      </ul>
    </div>
  </article>
</template>

<script>
export default {
  props: ['provider', 'channels'],
  data() {
    return {
      hdChannels: [],
      sdChannels: [],
    };
  },
  methods: {
    sortChannels() {
      this.channels.forEach(channel => {
        if (channel.quality === 'HD') {
          this.hdChannels.push(channel);
        } else {
          this.sdChannels.push(channel);
        }
      });
    },
  },
  created() {
    this.sortChannels();
  },
};
</script>

<style>
.small-text {
  color: red;
  font-size: 80%;
}
</style>
