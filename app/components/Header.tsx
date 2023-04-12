import { Box, Button, Heading, Icon, useColorMode } from "@chakra-ui/react";
import { BsMoonStarsFill } from "react-icons/bs";

type props = {
  title: string,
  leftIcon: any,
  rightIcon: any,
}

export default function Header({title, leftIcon, rightIcon}: props){
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <Box color={colorMode === "light" ? "black" : "white"} p={"0 20px"} display={"flex"} flexDir={"row"} justifyContent={"space-between"} alignItems={"center"} h={"60px"} w={"100%"}>
      {leftIcon}
        {/* {colorMode === 'light' ? 'Dark' : 'Light'} */}
      <Heading as="h1" size="xl" color={colorMode === "light" ? "black" : "white"} fontWeight="bold" textAlign="center">
        {title}
      </Heading>
      {rightIcon}
      {/* Toggle {colorMode === 'light' ? 'Dark' : 'Light'} */}
    </Box>
  );
}