<template>
    <div class="signup">
        <navbar></navbar>
        <div class="container">
            <div class="columns is-centered ">
                <div class="column is-one-third">
                    <div class="box">
                        <div class="content">
                            <h2>Login</h2>
                            <hr>
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

                            <button class="button is-success" @click=login()>Login</button>


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
        name: 'Login',
        data() {
            return {
                user: {}
            }
        },
        methods: {
            login() {
                this.$axios.post('/auth/login', this.user).then(resp => {
                    localStorage.setItem('user', JSON.stringify(resp.data.data))
                    this.$router.push(`/polls`)
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
</style>