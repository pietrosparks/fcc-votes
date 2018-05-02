export default {
    computed: {
        isAuth() {
            if (localStorage.user) {
                return true
            } else return false
        }
    },
    mounted() {   
        if (this.isAuth) {
            this.id = JSON.parse(localStorage.user)
            this.auth = true
        }
        else this.auth = false
    }
}