import { Box } from "@chakra-ui/react";
import { Outlet } from "@remix-run/react";

export default function GameRoute(){
  return (
    <Box display={"flex"} flexDir={"column"} justifyContent={"center"} alignItems={"center"} h={"100vh"} w={"100vw"}>
      <Outlet />
    </Box>
  );
}