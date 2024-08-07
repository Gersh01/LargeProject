import { useState } from "react";
import { Fragment } from "react";
import Bubble from "../reusable/Bubble";
import {
	MdOutlineModeEdit,
	MdOutlineKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getTechnology } from "../../utils/utility";
import { updateUserTechnology } from "../../pages/loaders/updateUser";
import { updateTechnologies } from "../../store/slices/userSlice";
import SelectionSearchField from "../reusable/SelectionSearchField";

const TechnologiesField = ({ title, type, privateView, technologies }) => {
	const user = useSelector((state) => state.user);
	const [mode, setMode] = useState(type);
	const dispatch = useDispatch();

	const editStyles = !mode
		? "bg-gray-300 dark:bg-gray-700 p-2 rounded-md"
		: "";

	//deletes the technology the user clicks on
	const removeTech = (text) => {
		const newList = user.technologies.filter((item) => {
			return item !== text;
		});
		dispatch(updateTechnologies(newList));
		updateUserTechnology(user.id, newList);
	};

	const renderedBubbles =
		mode === false ? (
			<Fragment>
				{technologies?.map((value) => (
					<Bubble
						removable
						text={value}
						key={value}
						onRemove={removeTech}
					/>
				))}
			</Fragment>
		) : (
			<Fragment>
				{technologies?.map((value) => (
					<Bubble text={value} key={value} />
				))}
			</Fragment>
		);

	const addNewTechnology = (newTech) => {
		if (newTech.length === 0 || user.technologies.includes(newTech)) {
			return;
		}

		let updatedTechnologies = [...user.technologies, newTech];

		dispatch(updateTechnologies(updatedTechnologies));

		updateUserTechnology(user.id, updatedTechnologies);
	};

	return (
		<div className="flex flex-col gap-2 overflow-hidden">
			<div className="flex justify-between">
				<p className="text-2xl font-semibold">{title}</p>
				{privateView && (
					<button
						className=""
						aria-label="edit/save button"
						onClick={() => {
							setMode(!mode);
						}}
					>
						{mode ? (
							<MdOutlineModeEdit className="text-2xl" />
						) : (
							<MdOutlineKeyboardDoubleArrowUp className="text-2xl" />
						)}
					</button>
				)}
			</div>
			{mode ? null : (
				<SelectionSearchField
					onAdd={addNewTechnology}
					selectionFunc={getTechnology}
				/>
			)}
			<div
				className={`grow flex gap-2 flex-wrap overflow-y-auto ${editStyles} scroll-bar`}
			>
				{renderedBubbles}
			</div>
		</div>
	);
};

export default TechnologiesField;
