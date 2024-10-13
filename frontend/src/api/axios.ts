import axios from "axios";
import _ from "lodash";

const baseURL = import.meta.env.VITE_GULLU_URL ?? "/";

const createAxiosInstance = () => {
  const opts = (() => {
    const jwtToken = localStorage.getItem("jwt") ?? "";
    return {
      baseURL,
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
  })();
  return axios.create(opts);
};

const instance = createAxiosInstance();

instance.interceptors.request.use(
  (request) => {
    const jwtToken = localStorage.getItem("jwt");
    if (_.isEmpty(jwtToken)) {
      signOutHandler();
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.status || (error.response ? error.response.status : 0);
    if (status === 401) {
      signOutHandler();
    }
    return Promise.reject(error);
  }
);

export const Axios = () => instance;

export const signOutHandler = async () => {
  const loginPage = `${window.location.origin}/login`;
  const currentPage = window.location.href;
  try {
    // await Axios().post("/dj-rest-auth/logout/");
    localStorage.removeItem("jwt");
    if (currentPage !== loginPage) {
      window.location.href = loginPage;
    }
  } catch (e) {
    console.log(e);
  }
};
