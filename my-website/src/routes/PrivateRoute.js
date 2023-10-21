import { useState } from "react";
import { Alert } from "react-bootstrap";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const PrivateRoute = (props) => {
  const account = useSelector((state) => state.user.account);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (account) {
      props.role.map((item) => {
        if (account.role === item) {
          setIsAuth(true);
        }
      });
    }
  }, [account]);

  if (isAuth) {
    return <>{props.children}</>;
  }

  return (
    <>
      <Alert variant="danger" className="mt-3">
        <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
        <p>
          Change this and that and try again. Duis mollis, est non commodo
          luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
          Cras mattis consectetur purus sit amet fermentum.
        </p>
      </Alert>
    </>
  );
};

export default PrivateRoute;
