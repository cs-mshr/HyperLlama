import { notifyError } from "@/utils/notification";
import { useForm } from "@mantine/form";
import { hideNotification } from "@mantine/notifications";
import { StatusCodes } from "http-status-codes";
import useMountedState from "./useMountedState";
import { useLocation, useNavigate } from "react-router-dom";
import { HOME_ROUTE } from "@/constants/routes";
import { useId } from "@mantine/hooks";
import { useEffect, useMemo } from "react";
import { isAxiosError } from "axios";
import _ from "lodash";
import { Axios } from "@/api/axios";

export const useLoginForm = () => {
  const notificationId = useId();
  const queryParams = getQueryParam();
  const [loading, setLoading] = useMountedState(false);
  const [error, setError] = useMountedState<string | null>(null);
  const auth = localStorage.getItem("jwt");
  const nav = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (auth) {
      nav(
        {
          pathname: HOME_ROUTE,
        },
        { replace: true }
      );
    }
  }, []);

  const form = useForm({
    initialValues: {
      username: queryParams.username ?? "",
      password: queryParams.password ?? "",
      email: queryParams.email ?? "",
    },
    validate: {
      username: (value) => (value ? null : ""),
      password: (value) => (value ? null : ""),
      email: (value) => (value ? null : ""),
    },
    transformValues: (values) => {
      return {
        username: values.username.trim(),
        password: values.password.trim(),
        email: values.email.trim(),
      };
    },
  });

  const handleSubmit = () => {
    return form.onSubmit(async (data) => {
      try {
        setLoading(true);
        setError(null);
        hideNotification(notificationId);

        const res = (await loginIn(
          data.username,
          data.password,
          data.email
        )) as any;

  
        switch (res.status) {
          case StatusCodes.OK: {
            const pathname = location.state?.from?.pathname || HOME_ROUTE;
            const token = res.data;
            if (token.key) {
              localStorage.setItem("jwt", token.key);
              Axios().defaults.headers.Authorization = `Bearer ${token.key}`;
              nav(
                {
                  pathname,
                },
                { replace: true }
              );
            }

            break;
          }

          case StatusCodes.UNAUTHORIZED: {
            setError("Invalid credential");
            break;
          }
          default: {
            setError("Request Failed!");
          }
        }
      } catch (err) {
        if (isAxiosError(err)) {
          const errStatus = err.response?.status;
          if (errStatus === 401) {
            setError("Unauthorized User");
            notifyError({
              message: "The request failed with a status code of 401",
            });
          } else {
            const errMsg = _.isString(err.response?.data)
              ? err.response?.data || "Something went wrong"
              : "Something went wrong";
            setError(errMsg);
            notifyError({ message: errMsg });
          }
        } else {
          setError("Request Failed!");
          notifyError({ message: "Something went wrong" });
        }
      } finally {
        setLoading(false);
      }
    });
  };

  return { ...form, loading, handleSubmit, error };
};

const getQueryParam = () => {
  const location = useLocation();
  return useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("q");
    if (!query) return {};
    const base64 = query
      .replaceAll(".", "+")
      .replaceAll("_", "/")
      .replaceAll("-", "=");
    const decoded = atob(base64);
    try {
      const obj = JSON.parse(decoded);
      return obj;
    } catch (e) {
      return {};
    }
  }, [location]);
};

const loginIn = async (username: string, password: string, email: string) => {
  const url = "/dj-rest-auth/login/";
  const res = await Axios().post(url, {
    username,
    password,
    email,
  });
  console.log(res);
  return res;
};