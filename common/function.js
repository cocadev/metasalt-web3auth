export function GetRandomInt(max) {
  return Math.floor(Math.random() * max)
}

export function GetRandomIntInRange(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}
