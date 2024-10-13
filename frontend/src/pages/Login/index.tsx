import Loading from "@/components/Loading";
import { useLoginForm } from "@/hooks/useLoginForm";
import {
  Box,
  Button,
  PasswordInput,
  Text,
  TextInput,
  Transition,
} from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";
import { FC } from "react";
import loginStyles from "./styles/Login.module.css";

const Login: FC = () => {
  useDocumentTitle("Parseable | Login");

  const { getInputProps, isValid, loading, handleSubmit, error } =
    useLoginForm();

  const classes = loginStyles;
  const {
    container,
    formContainer,
    titleStyle,
    formInput,
    loginBtnStyle,
    errorStyle,
    sideContainer,
  } = classes;

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100vw",
      }}
    >
      <Box className={sideContainer}>
        <Box
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text size={"xl"}>Uber Uber</Text>
          <Text color="dimmed" size={"md"}>
            The best way to get around
          </Text>
        </Box>
      </Box>
      <Transition
        mounted
        transition="fade"
        duration={10000}
        timingFunction="ease"
      >
        {(styles) => (
          <Box style={styles} className={container}>
            <form className={formContainer} onSubmit={handleSubmit()}>
              <Loading visible={loading} variant="oval" position="absolute" />
              <Text mt="xl" className={titleStyle}>
                👋 Welcome back
              </Text>
              <Text mt="sm" size={"sm"} color="dimmed">
                Please enter your credentials
              </Text>

              {error && (
                <Text mt="xs" className={errorStyle}>
                  {error}
                </Text>
              )}
              <TextInput
                mt="sm"
                className={formInput}
                placeholder="J.Doe"
                label="Username"
                withAsterisk
                {...getInputProps("username")}
              />
              <PasswordInput
                mt="lg"
                className={formInput}
                placeholder="**********"
                label="Password"
                withAsterisk
                {...getInputProps("password")}
              />
              <Button
                type="submit"
                my="xl"
                className={loginBtnStyle}
                disabled={!isValid()}
              >
                Login
              </Button>
            </form>
          </Box>
        )}
      </Transition>
    </Box>
  );
};

export default Login;
