import Divider from "../components/reusable/Divider";
import { Fragment, useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { useSelector } from "react-redux";
import { getProjects } from "./loaders/projectLoader";
import logo from "../assets/DFLogoFinal.png";
import DiscoverProjectTile from "../components/discover/DiscoverProjectTile";
import BioProfileFields from "../components/profile/BioProfileFields";
import TechnologiesField from "../components/profile/TechnologiesField";

const ProfilePage = () => {
	let res = useSelector((state) => state.user);
	const tech = res.technologies;

	const [projects, setProjects] = useState(useLoaderData());
	const [endOfSearch, setEndOfSearch] = useState(false);

	const projectsContainerRef = useRef();

	useEffect(() => {
		// * Adding scroll listener to window
		window.addEventListener("scroll", handleScroll);
		console.log("Debug: Adding Event listner");
		// * Load
		if (projectsContainerRef.current.clientHeight <= window.innerHeight) {
			if (!endOfSearch) {
				retrieveMoreProjects();
			}
		}

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	});

	if (!projects) {
		return null;
	}

	const renderedProjectTiles = projects.map((project) => {
		return <DiscoverProjectTile key={project._id} project={project} />;
	});

	// * Lazy loading more projects
	const retrieveMoreProjects = async () => {
		const newProjects = await getProjects({
			searchBy: "title",
			sortBy: "recent",
			query: "",
			count: 4,
			initial: false,
			projectId: projects[projects.length - 1]._id,
		});

		setProjects([...projects, ...newProjects]);

		if (newProjects.length === 0) {
			setEndOfSearch(true);
		}
	};

	// * Only lazy load when reaching end of projects
	const handleScroll = () => {
		const bottom =
			window.innerHeight + window.scrollY >= document.body.scrollHeight;

		if (bottom) {
			retrieveMoreProjects();
		}
	};

	return (
		<Fragment>
			<div
				className="flex justify-between items-end flex-wrap gap-y-2 min-w-[100px]
					poppins text-4xl font-bold gap-x-6"
			>
				<p>Profile</p>
			</div>
			<Divider />
			<div className="flex min-w-[100px] gap-5">
				<img
					className="max-h-20 max-w-20 md:max-h-28 md:max-w-28 rounded-full"
					src={logo}
				></img>
				<p className="flex items-center text-2xl md:text-4xl font-bold poppins text-wrap text-center ">
					{res.username}
				</p>
			</div>
			<div className="flex flex-wrap gap-8 py-4">
				{/* Bio Field*/}
				<div className="flex flex-col w-full h-80 p-4 rounded-2xl dark:bg-gray-900 bg-gray-50 lg:w-3/5 text-xl poppins">
					<BioProfileFields title="Bio" info={res.bio} type={true} />
				</div>
				{/*Technologies fields*/}
				<div className="flex flex-col p-4 rounded-2xl h-80 dark:bg-gray-900 bg-gray-50 w-full lg:w-1/5 lg:grow poppins text-xl">
					<TechnologiesField
						technologies={tech}
						title="Technologies"
						type={true}
					/>
				</div>
			</div>
			<p className="text-3xl poppins font-semibold">Projects</p>
			<div
				className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-8 pb-12"
				ref={projectsContainerRef}
			>
				{renderedProjectTiles}
			</div>
			{endOfSearch && (
				<div className="self-center px-8 py-1 mb-12 rounded-full bg-gray-50 dark:bg-gray-900">
					End of Search
				</div>
			)}
		</Fragment>
	);
};

export default ProfilePage;
