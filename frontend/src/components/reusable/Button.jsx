import classNames from "classnames";
import { twMerge } from "tailwind-merge";

// * mode: "secondary" -> gray background
// * mode: "danger" -> red background
// * mode: "safe" -> green background
// * mode: "white" -> white background
// * large: boolean -> indicate whether button should be enlarged
const Button = ({ children, large, mode, ...rest }) => {
	const buttonStyles = twMerge(
		classNames(
			"px-2 py-1 bg-orange-500 dark:bg-violet-600 poppins text-white font-medium rounded-md",
			{
				"px-3 py-1.5 text-lg font-semibold": large,
				"bg-none bg-gray-500 dark:bg-gray-500": mode === "secondary",
				"bg-none bg-white dark:bg-white text-black": mode === "white",
				"bg-none bg-red-600 dark:bg-red-600": mode === "danger",
				"bg-none bg-green-700 dark:bg-green-700": mode === "safe",
			}
		)
	);

	return (
		<button data-testid="button" className={buttonStyles} {...rest}>
			{children}
		</button>
	);
};

export default Button;
