import { useDispatch } from "react-redux";
import AppRoutes from "./routes/AppRoutes.js";
import { useEffect } from "react";
import { handleRefresh } from "./redux/actions/userAction.js";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("RefreshToken")) {
      dispatch(handleRefresh());
    }
  }, []);
  return (
    <>
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        limit={1}
      />
    </>
  );
}

export default App;
