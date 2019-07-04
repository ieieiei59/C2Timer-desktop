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
  getComputedTime () {
    if (this.isPlus2) {
      return this.time + 2
    } else if (this.isDnf) {
      return 'DNF'
    } else {
      return this.time
    }
  }
  static alignTime (time, num) {
    let minText = '0'
    let secText = '00'
    let decText = '000'
    let minFlag = false
    if (time > 60) {
      minText = Math.floor(time / 60).toString()
      minFlag = true
    }
    if (time > 1) {
      secText = Math.floor(time % 60).toString()
      secText = ('00' + secText).slice(-2)
    }
    if (time > 0) {
      decText = Math.floor((time % 1) * 1000).toString()
      decText = ('000' + decText).slice(-3)
      decText = decText.slice(0, num)
    }
    let returnText = ''
    if (minFlag) {
      returnText = minText + ':' + secText + '.' + decText
    } else {
      returnText = secText + '.' + decText
    }
    return returnText
  }
  getTimeText (num = 3) {
    return Time.alignTime(this.getComputedTime(), num)
  }
}
