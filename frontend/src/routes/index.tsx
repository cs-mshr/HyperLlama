import {
  ALL_ROUTE,
  HOME_ROUTE,
  LOGIN_ROUTE,
  REGISTER_ROUTE,
} from "@/constants/routes";
import FullPageLayout from "@/layouts/FullPageLayout";
import NotFound from "@/pages/Errors/NotFound";
import type { FC } from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import { HomeElement, LoginElement, RegisterElement } from "./elements";

const AppRouter: FC = () => {
  return (
    <FullPageLayout>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path={HOME_ROUTE} element={<HomeElement />} />
        </Route>

        <Route path={REGISTER_ROUTE} element={< RegisterElement/>} />
        <Route path={LOGIN_ROUTE} element={<LoginElement />} />
        <Route path={ALL_ROUTE} element={<NotFound />} />
      </Routes>
    </FullPageLayout>
  );
};

export default AppRouter;
