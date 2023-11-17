import { useLocation } from "react-router-dom/cjs/react-router-dom";

const Buying = () => {
  const location = useLocation();
  const data = location.state.data;

  return <div>abc{console.log(data)}</div>;
};

export default Buying;
