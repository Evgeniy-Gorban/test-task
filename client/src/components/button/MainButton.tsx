import { useNavigate } from "react-router-dom";

const MainButton = () => {
  const navigate = useNavigate();
  return <button onClick={() => navigate("/")}>Test-task</button>;
};

export default MainButton;
