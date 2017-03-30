<template>
  <div>
    <div class="tile is-ancestor" droppable="true">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <h4 class="title"></h4>
          <div class="table is-striped">
            <div class="columns is-gapless is-multiline">
              <div class="column is-12 columns thead is-desktop">
                  <div class="column is-1 th">Date</div>
                  <div class="column is-1 th">Type</div>
                  <div class="column is-1 th">Start time</div>
                  <div class="column is-1 th">End time</div>
                  <div class="column is-1 th">Time spent</div>
                  <div class="column is-1 th">Overtime</div>
                  <div class="column is-6 th">Note</div>
                  
              </div>
              <div class="column is-12 columns is-gapless is-multiline">
                <template v-if="datedata.holidays" v-for="item in itemlist">
                      <TimesheetRow :data="item" :key="item.date" v-on:changed="onDataChanged($event)"></TimesheetRow>
                </template>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>

  </div>


</template>

<script>
  import moment from 'moment'
  import TimesheetRow from './TimesheetRow'
  import Datepicker from 'vue-bulma-datepicker'
  import axios from 'axios'
  import UserProfileService from './../../services/userprofileservice'

  export default {
    components: {
      TimesheetRow,
      Datepicker
    },

    props: {
      initialdatetime: String,
      users: Array
    },

    data: function () {
      return {
        datedata: {}
      }
    },

    computed: {
      itemlist: function () {
        if (!this.datedata.currentmonth) return
        var days = this._getDaysInMonth(this.datedata.currentmonth)
        var temp = null
        var items = []
        console.log('calculate items')

        for (var i = 0; i < days; i++) {
          var thisDate = moment(this.datedata.currentmonth).add(i, 'd')
          temp = {
            date: thisDate.format('YYYY/MM/DD'),
            type: 'A',
            isoffwork: this._isWeekend(thisDate),
            isholiday: this._isHoliday(thisDate),
            start: '9:00',
            end: '18:00',
            timespent: '8:00',
            overtime: '0:00',
            note: 'Nothing'
          }
          items.push(temp)
        }

        return items
      }
    },
    
    watch: {
      initialdatetime: function () {
        this._init()
      }
    }, 

    methods: {
      _init: function () {
        var date = moment(this.initialdatetime, 'YYYYMM')
        
        this._getHolidays(date)
      },

      _getDaysInMonth: function (mDate) {
        return mDate.daysInMonth()
      },

      _isWeekend: function (mDate) {
        return mDate.weekday() === 0 || mDate.weekday() === 6
      },

      _isHoliday: function (mDate) {
        if (!this.datedata || !this.datedata.holidays) return
        var isHoliday = this.datedata.holidays.find(function (holiday) {
          return mDate.diff(new Date(holiday.date.year, holiday.date.month - 1, holiday.date.day)) === 0
        })
        return isHoliday
      },

      _getHolidays: function (mDate) {
        var self = this
        axios.get('http://kayaposoft.com/enrico/json/v1.0/?action=getPublicHolidaysForMonth&month=' + (mDate.month() + 1) + '&year=' + mDate.year() + '&country=' + 'jpn')
          .then(function (response) {
            self.datedata = {
                holidays: response.data,
                currentmonth: mDate
              }
          })
          .catch(function (error) {
            console.log('failed with error: ' + error)
          })
      },

      onDataChanged: function (item) {
      }
    },

  created () {
    this._init()

    UserProfileService.getListOf(function (data) { this.users = data.items })
  }
}

</script>

<style lang="scss">
  .table-responsive {
    display: block;
    width: 100%;
    min-height: .01%;
    overflow-x: auto;
  }
</style>