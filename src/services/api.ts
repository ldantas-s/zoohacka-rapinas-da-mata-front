import axios from "axios";

const api = axios.create({
	baseURL: "https://5aa8a3932019.ngrok.io",
});

export default api;
