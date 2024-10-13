import type { LoaderProps, LoadingOverlayProps } from "@mantine/core";
import { LoadingOverlay } from "@mantine/core";
import type { FC } from "react";

interface LoadingProps {
  variant?: LoaderProps["variant"];
  position?: "absolute" | "fixed" | "relative" | "static" | "sticky";
}

const Loading: FC<LoadingProps & LoadingOverlayProps> = (props) => {
  const { visible, variant, position, ...restProps } = props;

  return (
    <LoadingOverlay
      style={{
        position,
        height: "100%",
  
      }}
      loaderProps={{
        size: "md",
        variant,
      }}
      visible={visible}
      {...restProps}
    />
  );
};



export default Loading;
