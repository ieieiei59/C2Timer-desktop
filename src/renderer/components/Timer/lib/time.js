export class Time {
  constructor (time = 0, isPlus2 = false, isDnf = false, scramble = '') {
    this.time = time
    this.isPlus2 = isPlus2
    this.isDnf = isDnf
    this.scramble = scramble
    this.date = Date.now()
  }
  setTime (time) {
    this.time = time
  }
  setIsPlus2 (isPlus2) {
    this.isPlus2 = isPlus2
  }
  setIsDnf (isDnf) {
    this.isDnf = isDnf
  }
  setScramble (scramble) {
    this.scramble = scramble
  }
  setDate (date) {
    this.date = date
  }
}
