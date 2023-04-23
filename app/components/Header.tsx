import { Box, Button, Heading, Icon, useColorMode } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import { BsMoonStarsFill } from "react-icons/bs";
import styles from '../utils/fonts.css';

type props = {
  title: string,
  leftIcon?: any,
  rightIcon?: any,
}

export const links = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export default function Header({title, leftIcon, rightIcon}: props){
  const { colorMode, toggleColorMode } = useColorMode()
  return(
    <Box color={colorMode === "light" ? "black" : "white"} p={"0 20px"} display={"flex"} flexDir={"row"} justifyContent={"space-between"} alignItems={"center"} h={"60px"} w={"100%"}>
      {leftIcon}
        {/* {colorMode === 'light' ? 'Dark' : 'Light'} */}
      <Heading fontFamily={"Inter"}  as="h1" size="xl" color={colorMode === "light" ? "black" : "white"} fontWeight="bold" textAlign="center">
        <Link prefetch="intent" to="/">{title}</Link>
      </Heading>
      {rightIcon}
      {/* Toggle {colorMode === 'light' ? 'Dark' : 'Light'} */}
    </Box>
  );
}