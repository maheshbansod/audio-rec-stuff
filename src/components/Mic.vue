<script setup lang="ts">
import { computed, ref } from 'vue';
import Visualizer from './Visualizer.vue';
import { AudioDataType, VisualizerType } from '../types';
import { watch } from 'vue';
import { isPowerOf2 } from '../utils';

const props = defineProps<{
    audioDataType: AudioDataType;
    fftSize: number;
    visualizerType: VisualizerType;
}>();

let mediaStream: MediaStream;
let mediaRecorder: MediaRecorder;
let audioChunks: Blob[] = [];
let dataArray = new Uint8Array();
let analyzer: AnalyserNode;

const isRecording = ref(false);

const initialize = async () => {
    mediaStream = await navigator.mediaDevices.getUserMedia({audio: true});
    mediaRecorder = new MediaRecorder(mediaStream);
    
    attachListener();

    const audioCtx = new AudioContext();
    analyzer = audioCtx.createAnalyser();

    const source = audioCtx.createMediaStreamSource(mediaStream);
    source.connect(analyzer);

    analyzer.minDecibels = -45;
    analyzer.fftSize = props.fftSize;
    audioChunks = [];

    const bufferLength = analyzer.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
}

const startRecording = async () => {
    if (!mediaStream) {
        await initialize();
    }
    isRecording.value = true;
    audioChunks = [];
    mediaRecorder.start();
};

const stopRecording = ()=> {
    isRecording.value = false;
    mediaRecorder.stop();
}

const isIdle = computed(() => !isRecording.value);

const attachListener = () => {
    mediaRecorder.ondataavailable = e => {
        audioChunks.push(e.data);
        ;
    }
}

const getUpdatedAnalyzerData = () => {
    let scaleFactor = 1;
    if (props.audioDataType === AudioDataType.TimeDomain) {
        analyzer.getByteTimeDomainData(dataArray);
        scaleFactor = 128.0;
    } else if (props.audioDataType === AudioDataType.FrequencyDomain) {
        analyzer.getByteFrequencyData(dataArray);
        scaleFactor = 255.0;
    }
    return {data: dataArray, scaleFactor };
}

watch(() => props.fftSize, (newVal) => {
    if (!analyzer) return;
    if (!isPowerOf2(newVal) || newVal < 32) {
        console.error(`${newVal} not a power of 2`);
        return;
    }
    analyzer.fftSize = newVal;
    const bufferLength = analyzer.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
})

</script>

<template>
    <button v-if="isIdle" type="button" @click="startRecording">
        Record
    </button>
    <button v-if="isRecording" type="button" @click="stopRecording">
        Stop
    </button>
    <Visualizer v-if="analyzer" :get-data="getUpdatedAnalyzerData" :type="visualizerType"></Visualizer>
</template>