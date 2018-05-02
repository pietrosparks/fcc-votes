<template>
    <div>
        <span>

        </span>
        <nav class="navbar">
            <div class="navbar-brand">
                <a class="navbar-item">
                    <!-- <img src="https://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28"> -->
                </a>
                <div class="navbar-burger  burger" @click="openBurger()" :class="{'is-active':burger}" data-target="navbarExampleTransparentExample">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>

            <div id="navbarExampleTransparentExample" class="navbar-menu" :class="{'is-active':burger}">
                <div class="navbar-start">
                    <div class="field">
                        <div class="control" style="margin:5px 20px">
                            <router-link class="button" to="/polls">Home</router-link>
                        </div>

                    </div>

                </div>

                <div class="navbar-end">
                    <span v-if="auth==true">
                        <div class="navbar-item">
                            <div class="field user" >
                                <p class="control" style="color: white">Welcome {{id.name}}</p>
                            </div>
                            <div class="field">

                                <p class="control">
                                    <a class="button" @click="logout()">Logout</a>
                                </p>
                            </div>
                        </div>


                    </span>

                    <span v-else>
                        <div class="navbar-item">
                            <div class="field is-grouped">
                                <p class="control">
                                    <router-link class="button" to="/signup">Sign Up</router-link>
                                </p>
                                <p class="control">
                                    <router-link class="button" to="/login">Login</router-link>
                                </p>
                            </div>
                        </div>
                    </span>

                </div>
            </div>
        </nav>
    </div>
</template>

<script>
    export default {
        name: 'Signup',
        data() {
            return {
                id: '',
                auth: null,
                burger: false
            }
        },
        methods: {
            logout() {
                localStorage.clear();
                this.$router.push('/login')
            },
            openBurger() {
                this.burger = !this.burger
            }
        },

    }
</script>

<style scoped>
    .navbar {
        background-color: teal;
    }

    @media (min-width: 768px) {

        .user {
            margin: 5px 20px;
        }

    }



    .navbar-burger {
        background-color: white;
    }

    .navbar-menu {
        background-color: teal;
    }
</style>