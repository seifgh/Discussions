export default {
    computed: {
        isAuth() {
            return this.$store.state.user.isAuth;
        }
    },
    beforeMount() {
        if (this.isAuth) {
            this.$router.push("/discussions");
        }
    }
};