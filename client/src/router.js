import Router from "vue-router";
import Vue from "vue";
// -------------
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Discussions from "./pages/Discussions";
import Room from "./pages/discussions/Room";
import Settings from "./pages/discussions/Settings";
import Account from "./pages/discussions/settings/Account";
import ThemeColor from "./pages/discussions/settings/ThemeColor";

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
            name: "discussions",
            component: Discussions,
            children: [{
                    path: "room/:roomId",
                    component: Room
                },
                {
                    path: "settings",
                    component: Settings,
                    children: [{
                            path: "account",
                            name: "account",
                            component: Account
                        },
                        {
                            path: "theme-color",
                            name: "themeColor",
                            component: ThemeColor
                        }
                    ]
                }
            ]
        }
    ]
});