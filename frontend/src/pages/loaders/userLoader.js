import axios from "axios";
import { apiDomain } from "../../utils/utility";

const validateJwt = async () => {
	let auth = null;

	try {
		const response = await axios.post(
			apiDomain + "/api/jwtTest",
			null,
			{ withCredentials: true }
		);
		if (response) {
			auth = response.data;
			return auth;
		}
	} catch (err) {
		console.log(
			`An error occurred while getting user from JWT: ${err.message}`
		);
		return null;
	}
	return auth;
};

const getUserFromJwt = async () => {
	console.log("Debug: Getting user from JWT");

	const response = await axios.post(
		apiDomain + "/api/jwtTest",
		null,
		{ withCredentials: true }
	);

	return response.data;
};

export { validateJwt, getUserFromJwt };
