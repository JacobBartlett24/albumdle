import { Box } from "@chakra-ui/react";
import { Outlet } from "@remix-run/react";

export default function GameRoute(){
  return (
    <Box>
      <Outlet />
    </Box>
  );
}