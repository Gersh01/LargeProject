import Bubble from "../components/reusable/Bubble";
import Input from "../components/reusable/Input";
import Button from "../components/reusable/Button";
import NavBar from "../components/nav/NavBar";
import BubblePanel from "../components/reusable/BubblePanel";

const CreatePage = () => {
	
	//TODO: Finish Creation Function
	const doCreate = async (e) => {
	const [projectTitle, setProjectTitle] = useState("");
	const [startDate, setStartDate] = useState("");
	const [deadline, setDeadline] = useState("");
	const [description, setDescription] = useState("");
	const [expectations, setExpectations] = useState("");
	const [isOpen, setOpen] = useState(true);
	const [isDone, setDone] = useSate(false);
	const [isStarted, setIsStarted] = useState(false);
	const [dateCreated, setDateCreated] = ("TO BE UPDATED");
	const [ownerID, setOwnerID] = user._id;
	const [currentVsRequired, setCurrentVsRequired] = useState();
	const [technologies, setTechnologies] = useState([]);
	const [roles, setRoles] = useState([]);


  const navigate = useNavigate();
  const dispatch = useDispatch();

  //TODO: Finish Creation Function
  const doCreate = async (e) => {
    setErrorMessage("");
    if(
      //TODO: Must correctly build these out    
      projectTitle !== "" &&
      startDate !== "" &&
      deadline !== "" &&
      description !== "" &&
      expectations !== ""
    ){
      //TODO: May want to add Form validation (start date vs deadline checking, making sure roles are present, etc.)
      const validProject = () => {

      }
      
      //TODO: Function to calculate group size via counting of roles

      const newProject = {
        isOpen: isOpen,
        isDone: isDone,
        isStarted: isStarted,
        dateCreated: dateCreated,
        ownerID: ownerID,
        currentVsRequired: currentVsRequired,
        deadline: deadline,
        projectStartDate: startDate,
        roles: roles,
        technologies: technologies,
        title: projectTitle,
        description: description
      };

      try{
        const response = await Axios.post(
          "http://localhost:5000/api/projects",
          newProject
        );
        console.log(response.status);
        if(response && response.status === 201) {
          console.log("Positive response");
          //TODO: Immediately Navigate to created project
          navigate("/project");
        }

      } catch(err) {
        //TODO: Create Error messages based on error messages from API
        
      }
    };
	};

	return (
		<div>
			<NavBar />
			<div className="">
				{/* Project Title */}
				<Input
					titleText="Project Title"
					placeHolder="Enter Project Title"
				></Input>

				{/* TODO: Look into different format for date input */}
				<div className="flex gap-2">
					{/* Start Date */}
					<Input
						titleText="Start Date"
						placeHolder="Enter the start date"
					></Input>

					{/* Deadline */}
					<Input
						titleText="Deadline"
						placeHolder="Enter the deadline"
					></Input>
				</div>

				{/* Description */}
				<Input
					titleText="Description"
					placeHolder="Tell us all about your project"
				></Input>

				{/* TODO: Technologies */}
				<BubblePanel titleText="Technologies" techType></BubblePanel>

				{/* Expectations */}
				<Input
					titleText="Expectations"
					placeHolder="What do you need from your roles?"
				></Input>

				{/* TODO: Roles */}
				<BubblePanel titleText="Roles" roleType></BubblePanel>

				{/* TODO: Communication */}
				<BubblePanel titleText="Communication" commsType></BubblePanel>

				{/* Publish */}
				<Button onClick={doCreate} large>
					Publish
				</Button>
			</div>
		</div>
	);
};

export default CreatePage;
