import Vue from "vue";
import Vuex from "vuex";
import { API_ROUTES, axiosApi, getAuthToken, setAuthToken } from "./api";
import router from "./router";
import { resetThemeColor, setThemeColor } from "./theme-colors";
import { routerSafePush } from "./utils";

Vue.use(Vuex);

const initialState = (isLoading = false) => ({
    user: {
        data: null,
        isAuth: false,
        isLoading
    },
    rooms: {
        data: [],
        isLoading: false
    },
    openRoom: {
        data: null,
        messages: {
            data: [],
            hasMore: true,
            isLoading: true
        },
        isLoading: false
    },
    togglers: {
        showMenu: true
    }
});

export default new Vuex.Store({
    state: initialState(true),
    getters: {
        getRoomById: state => roomId => {
            return state.rooms.data.find(({ _id }) => _id == roomId);
        },
        isCurrentUser: state => userId => state.user.data._id == userId,
        rooms: ({ rooms }) => {
            rooms.data = rooms.data.sort(
                (r1, r2) => new Date(r2.updatedAt) - new Date(r1.updatedAt)
            );
            return rooms;
        },
        getOpenRoomLastMessageCreationDate: state => {
            const lastMessage = state.openRoom.messages.data[0];
            return lastMessage && lastMessage.createdAt;
        },
        isCurrentOpenRoom: state => roomId => {
            const openRoomData = state.openRoom.data;
            return openRoomData && openRoomData._id == roomId;
        },
        openRoomMembers: (state, getters) => {
            return state.openRoom.data.members.filter(
                ({ _id }) => !getters.isCurrentUser(_id)
            );
        }
    },
    mutations: {
        setUser(state, { fullName, email, createdAt, _id }) {
            state.user = {
                data: {
                    _id,
                    fullName,
                    email,
                    createdAt
                },
                isAuth: true,
                isLoading: false,
                fetchError: false
            };
        },
        logout(state) {
            Object.assign(state, initialState());
        },
        setRooms(state, { data = [], isLoading = false }) {
            state.rooms = {
                data: data.map(room => ({
                    ...room,
                    lastMessage: room.lastMessage || null
                })),
                isLoading
            };
        },
        setOpenRoom(
            state, {
                data = null, // { _id, name, creator, members, updatedAt, createdAt }
                isLoading = false,
                messages = {
                    data: [],
                    hasMore: true,
                    isLoading: false
                },
                fetchError = false
            }
        ) {
            state.openRoom = {
                data,
                messages,
                isLoading,
                fetchError
            };
        },
        setOpenRoomMessages(state, { data, hasMore = true, isLoading = false }) {
            state.openRoom.messages = {
                data: data || state.openRoom.messages.data,
                hasMore,
                isLoading
            };
        },
        toggleMenu(state) {
            const { showMenu } = state.togglers;
            state.togglers.showMenu = !showMenu;
        }
    },
    actions: {
        // on reload
        async loadAndAuthenticateUser(context) {
            if (getAuthToken()) {
                try {
                    const {
                        data: { user }
                    } = await axiosApi.get(API_ROUTES.getUser);
                    context.commit("setUser", user);
                    setThemeColor();
                } catch (err) {
                    if (err.response && err.response.status == 401)
                        context.dispatch("logout");
                }
            } else {
                context.commit("logout");
            }
        },
        setUser(context, { user, authToken, redirect = true }) {
            context.commit("setUser", user);
            setAuthToken(authToken);
            if (redirect) routerSafePush("/discussions");
        },
        logout(context) {
            context.commit("logout");
            setAuthToken(null);
            routerSafePush("/sign-in");
            resetThemeColor();
        },
        async fetchUserRooms(context) {
            context.commit("setRooms", { isLoading: true });
            const {
                data: { rooms }
            } = await axiosApi.get(API_ROUTES.getUserRooms);
            context.commit("setRooms", { data: rooms });
        },
        pushNewRoom(context, room) {
            const { data } = context.state.rooms;
            data.unshift(room);
            context.commit("setRooms", {
                data
            });
        },
        async fetchOpenRoom(context, roomId) {
            try {
                context.commit("setOpenRoom", { isLoading: true });
                const { data: room } = await axiosApi.get(
                    API_ROUTES.getRoomDetails(roomId)
                );
                context.commit("setOpenRoom", { data: room, isLoading: false });
            } catch (err) {
                routerSafePush("/discussions");
                context.commit("setOpenRoom", { fetchError: true, isLoading: false });
            }
        },
        async pushOpenRoomNewMessage(context, message) {
            const openRoomMessages = context.state.openRoom.messages;
            openRoomMessages.data.push(message);
            context.commit("setOpenRoomMessages", openRoomMessages);
        },
        updateRoomsLastMessage(context, message) {
            const updatedRooms = context.state.rooms.data.map(room => {
                room;
                if (message.room == room._id) {
                    room.lastMessage = message;
                    room.updatedAt = message.createdAt;
                }
                return room;
            });
            context.commit("setRooms", { data: updatedRooms });
        },
        async fetchOpenRoomMessages(context, onDone) {
            // fetch room messages with pagination by last message creation date
            context.commit("setOpenRoomMessages", { isLoading: true });
            const { roomId } = router.currentRoute.params;
            const { data: oldMessagesData } = context.state.openRoom.messages;
            const {
                data: { messages, hasMore }
            } = await axiosApi.get(
                API_ROUTES.getRoomMessages(
                    roomId,
                    context.getters.getOpenRoomLastMessageCreationDate
                )
            );
            messages.reverse();
            context.commit("setOpenRoomMessages", {
                data: [...messages, ...oldMessagesData],
                hasMore
            });
            if (onDone) onDone();
        },
        removeRoom(context, roomId) {
            let { data } = context.state.rooms;
            const openRoomId = context.state.openRoom.data._id;
            data = data.filter(({ _id }) => _id != roomId);
            context.commit("setRooms", {
                data
            });
            if (openRoomId == roomId) {
                context.commit("setOpenRoom", {});
                router.push("/discussions");
            }
        },
        updateRoomMembers(context, newRoom) {
            const userIsMember = !!newRoom.members.find(({ _id }) =>
                context.getters.isCurrentUser(_id)
            );
            if (userIsMember) {
                if (context.getters.isCurrentOpenRoom(newRoom._id)) {
                    const { openRoom } = context.state;
                    delete newRoom.lastMessage;
                    openRoom.data = newRoom;
                    context.commit("setOpenRoom", openRoom);
                } else {
                    const roomDoesNotExists = !context.getters.getRoomById(newRoom._id);
                    ({ roomDoesNotExists });
                    if (roomDoesNotExists) {
                        delete newRoom.members;
                        delete newRoom.creator;
                        delete newRoom.createdAt;
                        context.dispatch("pushNewRoom", newRoom);
                    }
                }
            } else {
                context.dispatch("removeRoom", newRoom._id);
            }
        }
    }
});