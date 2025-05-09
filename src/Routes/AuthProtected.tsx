import React, { useEffect, useState } from "react";
import { Navigate, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setCredentials } from "features/account/authSlice";

import Cookies from "js-cookie";
const AuthProtected = (props: any) => {
  const [canAccess, setCanAccess] = useState<boolean | null>(null);
  const urlPath = window.location.pathname;
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const tokenc = Cookies.get("astk");
  const dispatch = useDispatch();

  useEffect(() => {
    if (!tokenc) {
      setCanAccess(false);
    } else {
      axios
        .post(`${process.env.REACT_APP_API_URL}/api/user/get-user-by-token`, {
          token: tokenc,
        })
        .then((res: any) => {
          const user = {
            user: res,
          };
          dispatch(setCredentials(user));
          if (urlPath === "/") {
            setCanAccess(true);
          } else if (urlPath !== "/") {
            let access;
            if (urlPath === "/migration" && currentMonth !== 5) {
              access = false;
            } else {
              access = res.permissions.some(
                (permission: any) => permission.path === urlPath
              );
            }
            setCanAccess(access);
          }
        })
        .catch(() => {
          setCanAccess(false);
        });
    }
  }, [tokenc, urlPath, dispatch]);

  if (canAccess === null) {
    return <div>Loading...</div>;
  }

  if (canAccess === false /* && urlPath !== "/login" */) {
    if (!tokenc) {
      return <Navigate to="/login" />;
    } else if (tokenc) return <Navigate to="/auth-404" />;
  }

  return <>{props.children}</>;
};

const AccessRoute = ({ component: Component, ...rest }: any) => {
  return (
    <Route
      {...rest}
      render={(props: any) => {
        return (
          <>
            {" "}
            <Component {...props} />{" "}
          </>
        );
      }}
    />
  );
};

export { AuthProtected, AccessRoute };
