/**
 * Maps a value from one range of values to its equivalent, scaled in proportion to another range of values, using maximum and minimum.
 *
 * @param value - value input number
 * @param min1 - min1 Minimum value in the range of the input.
 * @param max1 - max1 Maximum value in the range of the input.
 * @param min2 - min2 Minimum value in the range of the output.
 * @param max2 - max2 Maximum value in the range of the output.
 * @returns The resulting mapped value between the new min and max
 * @public
 */
 export function dclmap(
    value: number,
    min1: number,
    max1: number,
    min2: number,
    max2: number
  ) {
    let range1 = max1 - min1
    let range2 = max2 - min2
  
    return ((value - min1) / range1) * range2 + min2
  }