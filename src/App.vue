<script setup lang="ts">
import { ref } from 'vue';
import Mic from './components/Mic.vue'
import { AudioDataType, VisualizerType } from './types';
import { computed } from 'vue';
import { pow2 } from './utils';

const audioDataType = ref<AudioDataType>(AudioDataType.FrequencyDomain);
const logFftSize = ref<number>(11);
const logFftSizeLimit = {min: 5, max: 15};

const fftSize = computed(() => pow2(logFftSize.value));

const visualizerType = ref<VisualizerType>(VisualizerType.Wave);
</script>

<template>
<div class="wrapper">
  <div>
    <div>
      Data type
      <v-btn-toggle v-model="audioDataType">
        <v-btn :value="AudioDataType.FrequencyDomain">Frequency</v-btn>
        <v-btn :value="AudioDataType.TimeDomain">Time</v-btn>
      </v-btn-toggle>
    </div>
    <div>
      Visualization type
      <v-btn-toggle v-model="visualizerType">
        <v-btn :value="VisualizerType.Bars">Bars</v-btn>
        <v-btn :value="VisualizerType.Wave">Wave</v-btn>
      </v-btn-toggle>
    </div>
    <div>
      fftSize
      <v-slider v-model="logFftSize" thumb-label="always"
      :min="logFftSizeLimit.min" :max="logFftSizeLimit.max" :step="1" >

        <template v-slot:thumb-label="{ modelValue }">
            {{ pow2(modelValue) }}
          </template>
    </v-slider>

    </div>
  </div>
  <Mic :audio-data-type="audioDataType" :fft-size="fftSize" :visualizer-type="visualizerType"></Mic>
</div>
</template>

<style scoped>
.wrapper {
  margin: 30px;
}
</style>
