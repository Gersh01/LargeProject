import AuthHeader from "../components/reusable/AuthHeader";
import { MdAccountCircle, MdLockOpen } from "react-icons/md";
import { useState } from "react";
import Input from "../components/reusable/Input";
import Button from "../components/reusable/Button";
import AuthPanel from "../components/reusable/AuthPanel";
import Axios from "axios";
import { useNavigate, Outlet } from "react-router-dom";
import { setUser } from "../store/slices/userSlice";
import { useDispatch } from "react-redux";
import { setVerificationEmail } from "../store/slices/systemSlice";
import { apiDomain } from "../utils/utility";
import { validateLogin } from "../utils/validations";

const LoginPage = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [rememberMe, setRememberMe] = useState(false);
	const [passwordInput, setPasswordInput] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [errors, setErrors] = useState({});
	const [userInput, setUserInput] = useState("");

	const goToRegister = () => {
		navigate("/signup");
	};

	const goToResetPassword = () => {
		navigate("/reset-password-email");
	};
	//POST for Login API
	//uses the err.response.data.error to distinguish between error codes
	const doLogin = async (e) => {
		const loginAttempt = { username: userInput, password: passwordInput };
		const validationErrors = validateLogin(loginAttempt);

		setErrors(validationErrors);
		let hasValidationErrors = false;

		for (const errorType in validationErrors) {
			if (validationErrors[errorType].length !== 0) {
				hasValidationErrors = true;
				break;
			}
		}

		setErrorMessage("");
		if (hasValidationErrors === false) {
			e.preventDefault();
			const newLogin = {
				login: userInput,
				password: passwordInput,
				rememberMe: rememberMe,
			};
			try {
				const response = await Axios.post(
					apiDomain + "/api/login",
					newLogin,
					{
						withCredentials: true,
					}
				);

				if (response && response.data) {
					dispatch(setUser(response.data));

					navigate("/discover");
				}
			} catch (err) {
				let errorMessage = err.response.data.error;
				if (errorMessage === "User is not verified") {
					dispatch(setVerificationEmail(err.response.data.email));
					navigate("/email-verification");
				} else {
					setErrorMessage("Username/Password is incorrect");
				}
			}
		}
	};

	return (
		<AuthPanel width={480} minHeight={750}>
			<AuthHeader title="Login" />
			<div className="flex flex-col gap-2">
				<Input
					titleText="Email or Username"
					icon={<MdAccountCircle />}
					placeholder="Example@email.com"
					onChange={(e) => setUserInput(e.target.value)}
					errors={errors.username}
					onFocus={() => {
						setErrors({ ...errors, username: [] });
					}}
				/>
				<Input
					titleText="Password"
					placeholder="Password"
					icon={<MdLockOpen />}
					password
					onChange={(e) => setPasswordInput(e.target.value)}
					errors={errors.password}
					onFocus={() => {
						setErrors({ ...errors, password: [] });
					}}
				/>
				<div className="flex justify-between">
					<div className="flex gap-1 items-center poppins">
						<input
							className="h-4 aspect-square"
							type="checkbox"
							aria-label="remember me input"
							onChange={(event) => {
								setRememberMe(event.target.checked);
							}}
						/>
						<p className="text-black dark:text-white">
							Remember Me
						</p>
					</div>
					<button
						className="text-black dark:text-white poppins"
						onClick={goToResetPassword}
					>
						Forgot Password
					</button>
				</div>
				<div className="h-5 flex justify-ceneter text-black dark:text-white text-md poppins">
					<span className="crimson-pro text-lg text-red-500">
						{errorMessage}
					</span>
				</div>
			</div>

			<div className="flex flex-col gap-3">
				<Button onClick={doLogin} large>
					Login
				</Button>
				<hr></hr>
				<button
					className="text-black dark:text-white text-sm font-medium poppins"
					onClick={goToRegister}
				>
					Sign up instead
				</button>
			</div>
			<Outlet />
		</AuthPanel>
	);
};

export default LoginPage;
