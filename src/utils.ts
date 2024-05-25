
export function isPowerOf2(value: number){
    return (value & ( value - 1)) === 0;
}

export function pow2(value: number) {
    return 1 << value;
}