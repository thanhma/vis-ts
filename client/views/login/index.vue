<template>
  <div class="content has-text-centered">
    <h1 class="is-title is-bold">Login</h1>

    <div class="columns is-vcentered">
        <div class="column is-6 is-offset-3">
            <div class="box">
                <div v-show="error" style="color:red; word-wrap:break-word;">{{ error }}</div>
                <form v-on:submit.prevent="onSubmit">
                    <label class="label">Username</label>
                    <p class="control">
                        <input v-model="username" class="input" type="text" placeholder="username">
                    </p>
                    <label class="label">Password</label>
                    <p class="control">
                        <input v-model="password" class="input" type="password" placeholder="password">
                    </p>

                    <p class="control">
                        <label class="checkbox">
              <input type="checkbox">
              Remember me
            </label>
                    </p>

                    <hr>
                    <p class="control">
                        <button type="submit" class="button is-primary">Login</button>
                        <button class="button is-default">Cancel</button>
                    </p>
                </form>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import AuthenticationService from './../../services/authenticationservice'

export default {
  data () {
    return {
      username: '',
      password: '',
      error: ''
    }
  },

  // computed property for form validation state
  computed: {
    ...mapGetters({
      authenticated: 'authenticated'
    }),
    validation: function () {
      return {
        username: !!this.username.trim(),
        password: !!this.password.trim()
      }
    }
  },

  // methods
  methods: {
    ...mapActions([
      'doAuthentication'
    ]),
    onSubmit: function () {
      if (this.validation.username && this.validation.password) {
        AuthenticationService.login()
        .then(() => {
          this.$router.push('/home')
        })
        .catch(() => {
          this.error = 'The username or password was incorrect, try again'
        })
        // Service.UserAuthenticationService.commit(username, password)
        // .done(function () { router.redirect('Home') })
        // .failed(function () { this.message('Username or password incorrect!' )} )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .is-title {
      text-transform: capitalize;
  }
</style>