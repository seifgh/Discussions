import Notifications from "./Notifications";

export default {
    install(Vue, options = { defaultHideDuration: 5000, defaultAutoHide: true }) {
        Vue.component("notifications-plugin", Notifications);

        Vue.prototype.$notifications = Vue.observable({ list: [] });

        Vue.prototype.$removeAllNotifications = () =>
            (Vue.prototype.$notifications = Vue.observable({ list: [] }));

        Vue.prototype.$closeNotification = id => {
            Vue.prototype.$notifications.list = Vue.prototype.$notifications.list.filter(
                item => item.id != id
            );
        };

        Vue.prototype.$notify = ({
            type = "success",
            title = "Success",
            content,
            autoHide = options.defaultAutoHide,
            hideDuration = options.defaultHideDuration
        }) => {
            const id = Math.random();
            Vue.prototype.$notifications.list.unshift({
                id,
                type,
                title,
                content
            });
            if (autoHide) {
                // remove when duration done
                setTimeout(() => {
                    Vue.prototype.$closeNotification(id);
                }, hideDuration);
            }
            return id;
        };
    }
};