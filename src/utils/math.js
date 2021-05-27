export function pointsDistance(p1, p2) {
  return Math.sqrt(
    Math.pow(p1[0] - p2[0], 2) +
    Math.pow(p1[1] - p2[1], 2)
  )
}

export function sumArraysOneByOne(arr1, arr2) {
  if (arr1.length !== arr2.length)
    throw new Error("the array lenghtes are not equal")

  return arr1.map((v, i) => v + arr2[i])
}

export function validDeg(deg) {
  deg = deg % 360
  return (deg < 0) ? 360 + deg : deg
}

export const
  minMaxDistance = (arr) => Math.max(...arr) - Math.min(...arr),
  prettyFloatNumber = (num) => num // TODO 