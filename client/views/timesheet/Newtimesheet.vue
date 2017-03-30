<template>
  <div>
    <!--<datepicker :config="{ dateFormat: 'Y/M' }" v-model="initialdatetime"></datepicker> -->
    <input type="text" v-model="initialdatetime">
    <Createnew :initialdatetime="initialdatetime"></Createnew>
  </div>

</template>

<script>
  import { Createnew } from 'components/timesheet/'
  import Datepicker from 'vue-bulma-datepicker'
  import moment from 'moment'

  export default {
    components: {
      Createnew,
      Datepicker,
      moment
    },
    data () {
      return {
        initialdatetime: moment().format('YYYYMM')
      }
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