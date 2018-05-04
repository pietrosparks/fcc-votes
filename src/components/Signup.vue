<template>
  <div class="signup">
    <navbar></navbar>
    <div class="container">
      <div class="columns is-centered ">
        <div class="column is-one-third">
          <div class="box">
            <div class="content">
              <h2>Signup</h2>
              <hr>
            </div>
            <div class="field">
              <label class="label control">Name</label>
              <div class="control">
                <input class="input" type="name" placeholder="John Doe" v-model="user.name">
              </div>
            </div>
            <div class="field">
              <label class="label control">Email</label>
              <div class="control">
                <input class="input" type="email" placeholder="xyz@email.com" v-model="user.email">
              </div>
            </div>

            <div class="field">
              <label class="label control">Password</label>
              <div class="control">
                <input class="input" type="password" placeholder="Password" v-model="user.password">
              </div>
            </div>

            <div class="field ">
              <button class="button is-success" @click=signUp()>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import navbar from '@/components/Navbar';
  export default {
    name: 'Signup',
    data() {
      return {
        user: {},
      }
    },
    methods: {
      signUp() {
        this.$axios.post('/auth/signup', this.user).then(resp => {
          this.$responseModal(resp.data.status, resp.data.message, resp.data.status);
          this.$router.push('/login')
        }).catch(e => {
          this.$responseModal({
            type: e.response.data.status,
            title: 'Oops...',
            text: e.response.data.message,
            footer: '<a href>Why do I have this issue?</a>',
          })
        })
      }
    },
    components: {
      navbar
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container .columns {
    margin-top: 50px;
  }

  h2 {
    font-family: 'Do Hyeon'
  }
</style>