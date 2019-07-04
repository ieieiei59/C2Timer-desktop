<template>
  <div class="container">
    <!-- タイマー本体 -->
    <div class="timer-container">
        <!-- 各種設定 -->
      <!--
        <div class="timer-setting" id="timer-settings">
            <input class="uk-checkbox" name="inspection" type="checkbox" value="false" id="inspection"/>
            <label class="uk-form-label" for="inspection">インスペクション無し</label>              
        </div>
      -->
      <scramble></scramble>

      <!-- タイム表示 -->
      <div class="time-container">
        <div class="time" :class="[green ? 'green-text' : '', red ? 'red-text' : '']">{{ timeText }}</div>
      </div>

      <!-- ao5, ao12の表示 -->
      <div class="ao-area">
        <div class="ao5 aoN"><span>ao5:</span>{{ ao5 }}</div>
        <div class="ao12 aoN"><span>ao12:</span>{{ ao12 }}</div>
      </div>

      <div class="times-area">
        <div class="time-card-outer" v-for="(timeObj, index) in timeArray.slice().reverse().slice(0, 5)" :key='index' >
          <time-card class="time-card" :timeObj="timeObj"></time-card>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
// import { clearInterval, setInterval } from 'timers'
import {Time} from './Timer/lib/time'

const TimeCard = require('./Timer/TimeCard').default
const Scramble = require('./Scramble').default

export default {
  name: 'timer',
  data () {
    return {
      // インスペクション
      isInspection: true,
      inspectionStartDate: null,
      inspectionTime: 15,
      remainingTime: 15,
      inspectionRoop: null,

      // タイマーの状態保持用
      // statusNum と statusList は内部用
      status: 'init',
      statusNum: 0,
      statusList: null,
      isPlus2: false,
      isDnf: false,
      timeArray: [],

      // タイマー
      timerRoop: null,
      timerStartDate: null,
      time: 0.000,
      timeText: '00.000',
      red: false,
      green: false,
      timeObj: null,

      // hold
      holdOk: false,
      holdRoop: null,
      holdOkTime: 500,
      holding: false
    }
  },
  components: {
    scramble: Scramble,
    'time-card': TimeCard
  },
  created () {
    document.addEventListener(
      'keyup',
      event => this.keyup(event)
    )
    document.addEventListener(
      'keydown',
      event => this.keydown(event)
    )
    this.updateStatusList()
    console.log(this)
  },
  computed: {
    ao5: function () {
      return Time.alignTime(this.aoN(5), 3)
    },
    ao12: function () {
      return Time.alignTime(this.aoN(12), 3)
    }
  },
  methods: {
    aoN: function (n) {
      if (this.timeArray.length > n - 1) {
        const times = this.timeArray.slice(-n)
        console.log(times)
        let dnfCount = 0
        let maxTime = times[0].getComputedTime()
        let minTime = times[0].getComputedTime()
        let sumTime = 0
        times.forEach(time => {
          const timeValue = time.getComputedTime()
          if (time.isDnf) {
            dnfCount += 1
            if (dnfCount > 1) {
              return 'DNF'
            }
          } else {
            if (timeValue > maxTime) {
              maxTime = timeValue
            } else if (timeValue < minTime) {
              minTime = timeValue
            }
            sumTime += timeValue
          }
        })
        if (dnfCount > 0) {
          sumTime -= minTime
        } else {
          sumTime -= minTime + maxTime
        }
        return sumTime / (n - 2)
      } else {
        return ''
      }
    },
    addTimeToArray () {
      const time = new Time(this.time, this.isPlus2, this.isDnf, this.$children[0].getScramble())
      this.timeArray.push(time)
    },
    toGreen: function () {
      this.green = true
      this.red = false
    },
    toRed: function () {
      this.red = true
      this.green = false
    },
    toBlack: function () {
      this.red = false
      this.green = false
    },
    updateStatusList: function () {
      const hasInspection = ['init', 'inspection', 'start', 'stop']
      const withoutInspection = ['init', 'start', 'stop']
      this.statusList = this.isInspection ? hasInspection : withoutInspection
    },
    printDetail: function () {
      console.log('Status: ' + this.getStatus())
      console.log('+2: ' + this.isPlus2)
      console.log('DNF: ' + this.isDnf)
      console.log('Inspection time: ' + this.remainingTime)
      console.log('Solve time: ' + this.getTimeText())
    },
    switchStatus: function () {
      // タイマーの状態を変更（ロータリースイッチ的な変更をする）
      // console.log('switchStatus:\n\t' + this.status + ' ->')
      this.statusNum += 1
      this.statusNum %= this.statusList.length
      this.status = this.statusList[this.statusNum]
      // console.log('\t' + this.status)
    },
    getStatus: function () {
      // タイマーの状態を取得
      return this.status
    },
    setStatus: function (status) {
      try {
        this.statusNum = this.statusList.indexOf(status)
        this.status = this.statusList[this.statusNum]
      } catch (e) {
        return false
      }
      return true
    },

    startInspection: function () {
    // インスペクションをスタート
      this.resetInspection()
      this.inspectionStartDate = Date.now()
      this.isPlus2 = false
      this.countDownInspection()
      clearInterval(this.inspectionRoop)

      const inspectionRoop = window.setInterval(() => {
        this.countDownInspection()
        if (this.remainingTime < 0) {
          if (this.remainingTime < -2) {
            this.isDnf = true
            this.stopInspection()
            this.addTimeToArray()
            this.timeText = 'DNF'
            this.toRed()
            this.setStatus('init')
          }
        }
      }, 10)

      this.inspectionRoop = inspectionRoop
    },
    stopInspection: function () {
      window.clearInterval(this.inspectionRoop)
    },
    resetInspection: function () {
    // インスペクション用の変数を初期化
      this.remainingTime = this.inspectionTime
    },
    countDownInspection: function () {
    // インスペクションタイムを表示
      this.remainingTime = this.inspectionTime - Math.floor((Date.now() - this.inspectionStartDate) / 1000)
      this.timeText = this.remainingTime
    },
    getTime: function () {
      return this.time
    },
    startTimer: function () {
      this.resetTimer()
      this.timerStartDate = Date.now()
      if (this.remainingTime < 0) {
        this.isPlus2 = true
      }

      this.updateTimer()
      clearInterval(this.timerRoop)
      this.timerRoop = window.setInterval(() => {
        this.updateTimer()
      }, 100)
    },
    stopTimer: function () {
      window.clearInterval(this.timerRoop)
      this.time = (Date.now() - this.timerStartDate) / 1000
      this.timeObj = new Time(this.time, this.isPlus2, this.isDnf, this.$children[0].getScramble())
      this.displayTime()
    },
    resetTimer: function () {
      this.isPlus2 = false
      this.isDnf = false
      this.time = 0.000
    },
    updateTimer: function () {
      this.time = (Date.now() - this.timerStartDate) / 1000
      this.timeText = Time.alignTime(this.time, 1)
    },
    displayTime: function () {
      this.timeText = this.timeObj.getTimeText()
    },
    startHolding: function () {
      this.holding = true
      let holdTime = 0
      const holdStartDate = new Date()
      this.holdRoop = window.setInterval(() => {
        holdTime = (Date.now() - holdStartDate)
        if (holdTime >= this.holdOkTime) {
          this.holdOk = true
          window.clearInterval(this.holdRoop)
        }
      }, 10)
    },
    endHolding: function () {
      this.holding = false
      this.holdOk = false
      window.clearInterval(this.holdRoop)
    },
    printRoopIds: function () {
      console.log('inspectionRoop: ' + this.inspectionRoop)
      console.log('timerRoop: ' + this.timerRoop)
      console.log('holdRoop: ' + this.holdRoop)
    },
    spaceKeyUp: function () {
      switch (this.getStatus()) {
        case 'init':
        // 初期状態だった時
          if (this.statusList.includes('inspection')) {
            this.switchStatus()
          } else {
            if (this.holdOk) {
              this.switchStatus()
            }
          }
          break
        case 'inspection':
        // タイマーの状態がインスペクションだったときの処理
          if (this.holdOk) {
            this.switchStatus()
          }
          break
        case 'start':
        // タイマーの処理がスタートだったときの処理
          break
        case 'stop':
        // タイマーの状態がストップだったときの処理
          this.switchStatus()
          break
      }
      if (this.holding) {
        this.endHolding()
      }
    },
    spaceKeyDown: function () {
      switch (this.getStatus()) {
        case 'init':
        // 初期状態だった時
          if (!this.statusList.includes('inspection') && !this.holding) {
            this.startHolding()
          }
          break
        case 'inspection':
        // タイマーの状態がインスペクションにだったときの処理
          if (!this.holding) {
            this.startHolding()
          }
          break
        case 'start':
        // タイマーの処理がスタートだったときの処理
          this.switchStatus()
          break
        case 'stop':
        // タイマーの状態がストップになったときの処理
          break
      }
    },
    keyup: function (event) {
      switch (event.code) {
        case 'Space':
          this.spaceKeyUp()
          event.preventDefault()
          break
      }
    },
    keydown: function (event) {
      switch (event.code) {
        case 'Space':
          this.spaceKeyDown()
          event.preventDefault()
          break
      }
    }
  },
  watch: {
    status: function (newStatus, oldStatus) {
      switch (newStatus) {
        case 'init':
          this.$children[0].genScramble()
          this.resetInspection()
          this.resetTimer()
          break
        case 'inspection':
          this.toBlack()
          this.startInspection()
          break
        case 'start':
          this.toBlack()
          this.stopInspection()
          this.startTimer()
          break
        case 'stop':
          this.toBlack()
          this.stopTimer()
          this.addTimeToArray()
          break
      }
      this.printRoopIds()
    },
    isInspection: function (newIsInspection, oldIsInspection) {
      this.updateStatusList()
    },
    holdOk: function (newHoldOk, oldHoldOk) {
      if (newHoldOk) {
        this.toGreen()
      } else {
        this.toRed()
      }
    },
    holding: function (newHolding, oldHolding) {
      if (!newHolding) {
        this.toBlack()
      } else {
        if (this.holdOk) {
          this.toGreen()
        } else {
          this.toRed()
        }
      }
    }
  },
  beforeDestroy () {
    window.clearInterval(this.holdRoop)
    window.clearInterval(this.inspectionRoop)
    window.clearInterval(this.timerRoop)
  }
}
</script>

<style lang="sass" scoped>
.time
    font-weight: bold
    font-family: Mali
    font-size: 15vw

.container,
.ao-area,
.time-container
    display: flex
    justify-content: center

.container
    padding: 5rem 2rem

.ao-area
    flex-direction: column

.aoN
    font-family: Mali
    font-size: 3rem
    display: flex
    justify-content: center
    span
        margin-right: 1rem

.times-area
    display: flex
    flex-wrap: wrap
    width: 100%

    .time-card-outer
        width: 20%
        min-width: 180px
        align-items: stretch
        display: flex
        .time-card
            margin: 5px

.red-text
    color: var(--warning-color);

.green-text
    color: var(--correct-color)

</style>
