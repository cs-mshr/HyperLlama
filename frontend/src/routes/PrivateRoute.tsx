import { LOGIN_ROUTE } from "@/constants/routes";
import type { FC } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute: FC = () => {
  const auth = localStorage.getItem("jwt");
  const { pathname } = useLocation();

  return auth ? (
    <Outlet />
  ) : (
    <Navigate
      to={LOGIN_ROUTE}
      state={{
        from: {
          pathname,
        },
      }}
    />
  );
};

export default PrivateRoute;
