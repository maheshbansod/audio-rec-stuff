
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { VisualizerType, VisualizerDataFn } from '../types';

const props = defineProps<{
    getData: VisualizerDataFn;
    type: VisualizerType;
}>()

const canvasRef = ref<HTMLCanvasElement|null>(null);
const wrapperDiv = ref<HTMLDivElement|null>(null);

const destructors: (() => void)[] = []

onMounted(() => {
    const canvas = canvasRef.value!;
    const divEl = wrapperDiv.value!;
    const canvasCtx = canvas.getContext('2d')!;

    canvas.width = divEl.clientWidth;
    canvas.height = divEl.clientHeight;

    const width = canvas.width;
    const height = canvas.height;

    let lastAnimationFrame: number|undefined = undefined;
    function drawWave() {
        const {data, scaleFactor} = props.getData();
        canvasCtx.clearRect(0,0, width, height);

        canvasCtx.beginPath();
        canvasCtx.strokeStyle = 'rgb(0,0,0)';
        let x = 0;
        const sliceWidth = width/data.length;
        for (let i =0;i < data.length; i++){
            const v = data[i] / scaleFactor;
            const y = v * height / 2;

            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }
            
            x += sliceWidth;
        }
        canvasCtx.lineTo(width, height / 2);
        canvasCtx.stroke();

        lastAnimationFrame = window.requestAnimationFrame(draw);
    }

    function drawBars() {
        const {data, scaleFactor} = props.getData();
        canvasCtx.clearRect(0,0, width, height);

        canvasCtx.beginPath();
        canvasCtx.strokeStyle = 'rgb(0,0,0)';
        let x = 0;
        const sliceWidth = width/data.length; 
        for (let i =0;i < data.length; i++){
            const v = data[i] / scaleFactor;
            const barHeight = v * height;
            const y = height - barHeight;

            canvasCtx.rect(i * sliceWidth, y, sliceWidth, barHeight);
            
            x += sliceWidth;
        }
        // canvasCtx.lineTo(width, height / 2);
        canvasCtx.stroke();

        lastAnimationFrame = window.requestAnimationFrame(draw);
    }

    lastAnimationFrame = window.requestAnimationFrame(draw);

    function draw() {
        if (props.type === VisualizerType.Wave) {
            drawWave();
        } else if (props.type === VisualizerType.Bars) {
            drawBars();
        }
    }

    destructors.push(() => {
        window.cancelAnimationFrame(lastAnimationFrame!);
    })
});

onUnmounted(() => {
    for(const destructor of destructors) {
        destructor();
    }
})

</script>

<template>
<div class="wrapper" ref="wrapperDiv">
    <canvas ref="canvasRef">
    </canvas>
</div>
</template>

<style scoped>
.wrapper {
    width: 100%;
    height: 300px;
}
</style>