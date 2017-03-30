<template>
  <div id="app">
    <nprogress-container></nprogress-container>
    <navbar :show="true"></navbar>
    <router-view class="approot"></router-view>
  </div>
</template>

<script>
import NprogressContainer from 'vue-nprogress/src/NprogressContainer'
import Navbar from 'components/layout/Navbar'

export default {
  components: {
    NprogressContainer,
    Navbar
  }
}
</script>