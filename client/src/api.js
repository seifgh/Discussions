import axios from "axios";

export const getAuthToken = () => {
    if (localStorage.authToken) return "Bearer " + localStorage.authToken;
};

export const axiosApi = axios.create({
    baseURL: "http://localhost:4000",
    headers: {
        Authorization: getAuthToken()
    }
});

export const setAuthToken = authToken => {
    if (authToken) localStorage.authToken = authToken;
    else delete localStorage.authToken;
    axiosApi.defaults.headers.Authorization = getAuthToken();
};

export const API_ROUTES = {
    getUser: "/user/get",
    signIn: "/user/sign-in", // body: [email, password]
    signUp: "/user/sign-up", // body: [fullName, email, password]
    searchUsers: "/user/search", // body: [searchKey: [email or fullName] , excludedUsers]

    getUserRooms: "/room/user-rooms",
    createNewRoom: "/room/create", // body: [name, members:[userId] ]
    getRoomDetails: roomId => "/room/details/" + roomId,
    deleteRoom: roomId => "/room/delete/" + roomId,
    updateRoomMembers: roomId => "/room/update/members/" + roomId,

    getRoomMessages: (roomId, lastMessageCreationDate) =>
        "/message/room/" +
        roomId +
        (lastMessageCreationDate ?
            `?lastMessageCreationDate=${lastMessageCreationDate}` :
            ""),
    sendRoomMessage: roomId => "/message/send/" + roomId // body : [content]
};