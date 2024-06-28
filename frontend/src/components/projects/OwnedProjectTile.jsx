import ProjectTilePanel from "../reusable/ProjectTilePanel";
import { Fragment } from "react";
import { MdPerson, MdOutlineAccessTimeFilled } from "react-icons/md";

const OwnedProjectTile = ({ project }) => {
	const title = project.title;
	const description = project.description;
	// TODO - Calculate total people needed
	const numTotalPositions = 7;
	// TODO - Calculate number of people still needed
	const numDaysTilStart = Math.floor(
		(project.startDate - new Date()) / 1000 / 60 / 60 / 24 + 1
	);
	const numDaysTilEnd = Math.floor(
		(project.endDate - new Date()) / 1000 / 60 / 60 / 24 + 1
	);

	let dateMessage = "";

	if (numDaysTilStart > 0) {
		if (numDaysTilStart === 1) {
			dateMessage = `${numDaysTilStart} day until project begins`;
		} else {
			dateMessage = `${numDaysTilStart} days until project begins`;
		}
	} else {
		if (numDaysTilEnd === 1) {
			dateMessage = `due in ${numDaysTilEnd} day`;
		} else {
			dateMessage = `due in ${numDaysTilEnd} days`;
		}
	}

	const topContent = (
		<Fragment>
			{/* ROW 1 */}
			<div className="flex justify-between items-center flex-wrap">
				<p className="text-xl sm:text-2xl league-spartan font-semibold text-white">
					{title}
				</p>
			</div>
			{/* ROW 2 */}
			<div className="flex justify-between flex-wrap">
				<div className="flex gap-1 items-center">
					<p className="poppins text-white">{numTotalPositions}</p>
					<MdPerson className="text-xl text-white" />
				</div>
				<div className="flex gap-1 items-center">
					<MdOutlineAccessTimeFilled className="text-xl text-white" />
					<p className="poppins text-white">{dateMessage}</p>
				</div>
			</div>
		</Fragment>
	);

	const bottomContent = (
		<Fragment>
			{/* ROW 1 */}
			<div className="max-h-28 flex flex-col gap-2">
				<p className="poppins text-xl font-semibold">Description</p>
				<p className="grow crimson-pro text-lg overflow-hidden leading-6">
					{description}
				</p>
			</div>
		</Fragment>
	);

	return (
		<ProjectTilePanel
			topContent={topContent}
			bottomContent={bottomContent}
		></ProjectTilePanel>
	);
};

export default OwnedProjectTile;
