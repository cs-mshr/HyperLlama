import Loading from "@/components/Loading";
import {
  Box,
  Button,
  Divider,
  PasswordInput,
  Text,
  TextInput,
  Transition,
} from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";
import { FC } from "react";
import loginStyles from "./styles/Login.module.css";
import { useRegisterForm } from "@/hooks/useRegisterForm";

const Login: FC = () => {
  useDocumentTitle("Gullu | Register");

  const { getInputProps, isValid, loading, handleSubmit, error } =
    useRegisterForm();

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
          <Text size={"xl"}>Gullu Gullu</Text>
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
                👋 Register please
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
                error={getInputProps("username").error}
              />
              <TextInput
                mt="sm"
                className={formInput}
                placeholder="jon@email.com"
                label="Email"
                withAsterisk
                {...getInputProps("email")}
                error={getInputProps("email").error}
              />
              <PasswordInput
                mt="lg"
                className={formInput}
                placeholder="**********"
                label="Password"
                withAsterisk
                {...getInputProps("password")}
                error={getInputProps("password").error}
              />
              <Button
                type="submit"
                my="xl"
                className={loginBtnStyle}
                disabled={!isValid()}
              >
                Register
              </Button>
              <Divider
                label=" Or  "
                labelPosition="center"
                my="md"
                style={{ width: "100%" }}
              />

              <Button component="a" href="/login" variant="outline">
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
