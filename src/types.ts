export enum AudioDataType {
    TimeDomain,
    FrequencyDomain
}

export enum VisualizerType {
    Wave,
    Bars
}

export type VisualizerDataFn = () => {
    data: Uint8Array,
    scaleFactor: number
}