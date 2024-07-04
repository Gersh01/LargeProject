import { Fragment } from "react";
import {
    MdArrowLeft,
    MdPerson,
    MdOutlineAccessTimeFilled,
    MdMailOutline,
} from "react-icons/md";
import Divider from "../components/reusable/Divider";
import Button from "../components/reusable/Button";
import Bubble from "../components/reusable/Bubble";
import { useLoaderData, useNavigate } from "react-router-dom";
import RolesBubble from "../components/view/RolesBubble";

const ViewProjectPage = () => {
    const projectData = useLoaderData();
    const navigate = useNavigate();

    if (projectData === null) {
        return null;
    }
    const numTotalPositions = 9;

    const {
        title,
        projectStartDate,
        deadline,
        description,
        technologies,
        communications,
        roles,
        teamMembers,
    } = projectData;

    const numDaysTilStart = Math.floor(
        (new Date(projectStartDate) - new Date()) / 1000 / 60 / 60 / 24 + 1
    );
    const numDaysTilEnd = Math.floor(
        (new Date(deadline) - new Date()) / 1000 / 60 / 60 / 24 + 1
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

    const renderedTechnologyBubbles = technologies?.map((technology) => {
        return <Bubble key={technology} text={technology} />;
    });

    const renderedRolesRequirementBubbles = roles?.map((role) => {
        // TODO - Mock members (to be removed)
        // const members = [
        // 	{
        // 		name: "Alex",
        // 		id: "abc",
        // 	},
        // 	{
        // 		name: "James",
        // 		id: "abcd",
        // 	},
        // 	{
        // 		name: "Xutao",
        // 		id: "abcde",
        // 	},
        // ];

        const members = [];

        teamMembers.forEach((member) => {
            if (member.role === role.role) {
                members.push({
                    userId: member.userId,
                    username: member.username,
                });
            }
        });

        return (
            <RolesBubble
                key={role.role}
                role={role.role}
                description={role.description}
                count={role.count}
                currentCount={0}
                members={members}
            />
        );
    });

    const renderedCommunicationsBubbles = communications?.map((comm) => {
        return (
            <Bubble
                key={comm.name}
                text={comm.name}
                input={comm.link.length === 0 ? "None" : comm.link}
                writable
                readOnly
            />
        );
    });

    return (
        <Fragment>
            <button
                className="flex items-center self-start"
                onClick={() => {
                    navigate(-1);
                }}
            >
                <MdArrowLeft className="text-2xl" />
                <p className="text-xl font-semibold">Back</p>
            </button>
            {/* <Divider /> */}
            <p className="text-3xl font-semibold">{title}</p>
            <div className="flex gap-2 flex-wrap">
                <Button mode="safe">Begin</Button>
                <Button mode="secondary">Manage Team</Button>
                <Button mode="secondary">Edit</Button>
                <Button mode="danger">Delete</Button>
                <button
                    onClick={() => navigate(`/applications/${projectData._id}`)}
                >
                    <MdMailOutline className="size-8" />
                </button>
            </div>
            {/* TIME */}
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
            <Divider />
            {/* DESCRIPTION */}
            <div className="flex flex-col gap-2">
                <p className="text-xl font-semibold">Description</p>
                <p>{description}</p>
            </div>
            {/* POSITION REQUIREMENTS */}
            <div className="flex flex-col gap-2">
                <p className="text-xl font-semibold">Position Requirements</p>
                <div className="flex flex-col gap-4">
                    {renderedRolesRequirementBubbles}
                </div>
            </div>
            {/* TECHNOLOGIES */}
            <div className="flex flex-col gap-2">
                <p className="text-xl font-semibold">Technologies</p>
                <div className="flex flex-wrap gap-4">
                    {renderedTechnologyBubbles}
                </div>
            </div>
            {/* COMMUICATION */}
            <div className="flex flex-col gap-2">
                <p className="text-xl font-semibold">Communications</p>
                <div className="flex flex-wrap gap-4">
                    {renderedCommunicationsBubbles}
                </div>
            </div>
        </Fragment>
    );
};

export default ViewProjectPage;
