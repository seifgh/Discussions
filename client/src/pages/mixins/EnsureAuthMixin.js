export default {
    computed: {
        isAuth() {
            return this.$store.state.user.isAuth;
        },
        userData() {
            return this.$store.state.user.data;
        }
    },
    beforeMount() {
        if (!this.isAuth) {
            this.$router.push("/sign-in");
        }
    }
};