import Router from "vue-router";
import Vue from "vue";
// -------------
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Discussions from "./pages/Discussions";
import Room from "./pages/Room";
// --------------------

Vue.use(Router);
export default new Router({
    mode: "history",
    routes: [{
            path: "/",
            component: SignIn
        },
        {
            path: "/sign-in",
            component: SignIn
        },
        {
            path: "/sign-up",
            component: SignUp
        },
        {
            path: "/discussions",
            component: Discussions,
            children: [{
                path: ":roomId",
                component: Room
            }]
        }
    ]
});