import { Route } from "react-router-dom";
import NotFound from "./NotFound";
import {
  BrowserRouter,
  Switch,
} from "react-router-dom/cjs/react-router-dom.min";
import ListUser from "../containers/Admin/ListUser/ListUser";
import Signin from "../containers/Common/Signin/Signin";
import Login from "../containers/Common/Auth/Login";
import PrivateRoute from "./PrivateRoute";
import UserPage from "../containers/User/UserPage/UserPage";
import Home from "../containers/Common/Home/Home";
import Cart from "../containers/User/Cart/Cart";
import HomeContent from "../containers/Common/HomeContent/HomeContent";

const AppRoutes = () => {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact>
            <Home />
            <HomeContent />
          </Route>

          <Route path="/login">
            <Login />
          </Route>

          <Route path="/signin">
            <Signin />
          </Route>

          <Route path="/users">
            <Home />
            <PrivateRoute role={["AdminRole"]}>
              <ListUser />
            </PrivateRoute>
          </Route>

          <Route path="/user">
            <Home />
            <PrivateRoute role={["UserRole", "AdminRole"]}>
              <UserPage />
            </PrivateRoute>
          </Route>

          <Route path="/cart">
            <PrivateRoute role={["UserRole", "AdminRole"]}>
              <Cart />
            </PrivateRoute>
          </Route>

          <Route path="*">
            <Home />
            <NotFound />
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
};

export default AppRoutes;