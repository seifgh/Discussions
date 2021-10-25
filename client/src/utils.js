import router from "./router";

// push without throwing NavigationDuplicated error
export const routerSafePush = path => {
    router.push(path).catch(error => {
        if (error.name != "NavigationDuplicated") {
            throw error;
        }
    });
};

export const noRoomWasOpen = () => {
    return !router.currentRoute.params.roomId;
};

export const isToday = date => {
    const today = new Date();
    return (
        date.getDate() == today.getDate() &&
        date.getMonth() == today.getMonth() &&
        date.getFullYear() == today.getFullYear()
    );
};