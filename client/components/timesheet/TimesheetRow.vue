<template>
    <div class="column is-12 columns clonable" v-bind:class="{ weekend: data.isoffwork || data.isholiday }" v-if="data" @dragover.prevent>
        <div class="column is-1">{{ data.date }}</div>
        <div class="column is-1">{{ data.isoffwork || data.isholiday ? "Off-work" : '' }}<br/>
        <sub>{{ data.isholiday ? data.isholiday.localName : '' }}</sub></div>
        <div class="column is-1">
            <datepicker placeholder="Start time" :config="{ enableTime: true, enableSeconds: false, noCalendar: true, time_24hr: true }" v-model="start"></datepicker>
        </div>
        <div class="column is-1">
            <datepicker placeholder="End time" :config="{ enableTime: true, enableSeconds: false, noCalendar: true, time_24hr: true }" v-model="end"></datepicker>
        </div>
        <div class="column is-1 time" v-bind:class="{ ok: spend === OK, under: spend < OK, over: spend > OK }">{{ spend }}</div>
        <div class="column is-1">{{ overtime }}</div>
        <div class="column is-6"><input class="input" type="text" v-model="note" placeholder=""></div>
        <a class="clone" draggable="true" @dragstart="dragstart" @dragend="dragend" @drag="dragging">
            <span class="icon is-small">
                <i class="fa fa-arrow-down"></i>
            </span>
        </a>
    </div>
</template>
 
<script>
import Datepicker from 'vue-bulma-datepicker'
import moment from 'moment'
import $ from 'jquery'
import Notification from 'vue-bulma-notification'
import Vue from 'vue'

const NotificationComponent = Vue.extend(Notification)

const openNotification = (propsData) => {
    propsData = $.extend({
        title: '',
        message: '',
        type: '',
        direction: 'Right',
        duration: 2000,
        container: '.notifications'
        }, propsData)
  return new NotificationComponent({
    el: document.createElement('div'),
    propsData: propsData
  })
}

export default {
    components: {
        Datepicker,
        moment
    },
  props: {
    data: Object
  },
  data: function () {
      return {
        start: '09:00',
        end: '18:00',
        note: '',
        mousepos: null,
        startrowposition: null,
        OK: '08:00'
      }
  },
  computed: {
      spend: function () {
          var start = moment(this.start, 'HH:mm')
          var end = moment(this.end, 'HH:mm')

          if (this._timeBetween(start, end) <= 0) return '00:00'

          // TODO: apply lunch break rule
          var NORMAL_LUNCH_HOURS = 1 * 60

        return this._minutesToHhMm(this._timeBetween(start, end) - NORMAL_LUNCH_HOURS)
      },

      overtime: function () {
          var start = moment(this.start, 'HH:mm')
          var end = moment(this.end, 'HH:mm')
        
          // TODO: apply OT rule
          var NORMAL_WORK_HOURS = 9 * 60

        return this._timeBetween(start, end, 'm') - NORMAL_WORK_HOURS > 0 ? this._minutesToHhMm(this._timeBetween(start, end) - NORMAL_WORK_HOURS) : '00:00'
      }
  },

  methods: {
      _timeBetween: function (start, end, unit = 'm') {
          return end.diff(start, unit)
      },

      _minutesToHhMm: function (mins) {
        return moment.utc().startOf('day').add(mins, 'minutes').format('HH:mm')
      },

      _openNotificationWithType: function (type, title, message) {
            openNotification({
                title: title,
                message: message,
                type: type,
            })
        },

      dragstart: function (e) {
        var data = JSON.stringify({
            start: this.start,
            end: this.end,
            note: this.note
        })
        this.mousepos = e.pageY
        this.startrowposition = { bottom: $(this.$el).position().top + $(this.$el).height(), top: $(this.$el).position().top }

        window.sessionStorage.setItem('clonedata', data)
      },

      dragging: function (e) {
        var self = this
        var hoverables = null
        var length = e.pageY - self.mousepos - 14
        var direction = length > 0 ? 'down' : 'up'

        $('.clonable').removeClass('hovered')

        if (direction === 'down') {
            hoverables = $('.clonable').filter(function () {
                return $(this).position().top - self.startrowposition.bottom > 0 && $(this).position().top - self.startrowposition.bottom < length
            })

            $(hoverables).each(function () {
                if ($(this).position().top - self.startrowposition.bottom > 0 && $(this).position().top - self.startrowposition.bottom < length) {
                    $(this).addClass('hovered')
                }
            })
        } else {
            hoverables = $('.clonable').filter(function () {
                return $(this).position().top - self.startrowposition.top <= 0 && $(this).position().top - self.startrowposition.top >= length && $(this).position().top - self.startrowposition.top < 0
            })

            $(hoverables).each(function () {
                $(this).addClass('hovered')
            })
        }
      },

      dragend: function (e) {
        var self = this

        var data = JSON.parse(window.sessionStorage.getItem('clonedata'))
        var length = e.pageY - self.mousepos - 14
        var direction = length > 0 ? 'down' : 'up'
        var copiedcnt = 0
        // TODO: optimize 
        $(this.$parent.$children).each(function (i) {
            if (direction === 'down') {
                if ($(this.$el).position().top - self.startrowposition.bottom > 0 && $(this.$el).position().top - self.startrowposition.bottom < length) {
                    this.start = data.start
                    this.end = data.end
                    this.note = data.note
                    this.$children[0].datepicker.setDate(this.start)
                    this.$children[1].datepicker.setDate(this.end)

                    copiedcnt++
                } else if ($(this.$el).position().top - self.startrowposition.bottom > 0 && $(this.$el).position().top - self.startrowposition.bottom > length) {
                    return false
                }
            } else {
                if ($(this.$el).position().top - self.startrowposition.top <= 0 && $(this.$el).position().top - self.startrowposition.top >= length && $(this.$el).position().top - self.startrowposition.top < 0) {
                    this.start = data.start
                    this.end = data.end
                    this.note = data.note
                    this.$children[0].datepicker.setDate(this.start)
                    this.$children[1].datepicker.setDate(this.end)

                    copiedcnt++
                } else if ($(this.$el).position().top - self.startrowposition.top <= 0 && $(this.$el).position().top - self.startrowposition.top >= length && $(this.$el).position().top - self.startrowposition.top >= 0) {
                    return false
                }
            }
        })

        if (copiedcnt > 0) {
            this._openNotificationWithType('info', '', 'Copied')
        }

        window.sessionStorage.removeItem('clonedata')

        $('.clonable.hovered').removeClass('hovered')

        e.preventDefault()
      }
  },

  watch: {
      end: function () {
          this.$emit('changed')
      },
      start: function () {
          this.$emit('changed')
      },
      note: function () {
          this.$emit('changed', this.$data)
      }
  }
}
</script>

<style type="text/css">
/* TODO: To .scss */
.weekend{
    background: #f5f5f5;
}

.table.is-bordered .td, .table.is-bordered .th {
    border-width: 1px;
}

.table .th {
    font-weight: bold;
}

.table .td, .table .th, .clonable {
    border: 1px solid #dbdbdb;
    border-width: 0 0 1px;
    padding: 0.5em 0.75em;
    vertical-align: middle;
    border-collapse: collapse;
}

.table .thead .td, .table .thead .th {
    border-width: 0 0 2px;
    color: #7a7a7a;
}

.table {
    background-color: white;
    color: #363636;
    margin-bottom: 1.5rem;
    width: 100%;
}

.clonable:hover, .clonable.hovered {
    border-color: #00d1b2;
    border-collapse: collapse;
    background-color: aliceblue;
}

.clonable:hover > a.clone {
    display: block;
}

a.clone {
    display: none;
    position: relative;
    bottom: -2.5em;
    right: 1.3em;
}

.time.over {
    color: red;
}

.time.under {
    color: orange;
}

.time.ok {
    color: green;
}

</style>