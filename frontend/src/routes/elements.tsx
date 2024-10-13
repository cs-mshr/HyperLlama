import Home from "@/pages/Home";
import type { FC } from "react";
import { lazy } from "react";
import SuspensePage from "./SuspensePage";


export const HomeElement: FC = () => {
  return (
    <SuspensePage>
      <Home />
    </SuspensePage>
  );
};



const Login = lazy(() => import("@/pages/Login"));

export const LoginElement: FC = () => {
  return (
    <SuspensePage>
      <Login />
    </SuspensePage>
  );
};