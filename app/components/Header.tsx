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
    <Box p={"0 20px"}display={"flex"} flexDir={"row"} justifyContent={"space-between"} alignItems={"center"} h={"60px"} w={"100%"}>
      <Icon boxSize={6} as={leftIcon} onClick={toggleColorMode} _hover={{cursor: "pointer"}}/>
        {/* {colorMode === 'light' ? 'Dark' : 'Light'} */}
      <Heading as="h1" size="xl" color="black" fontWeight="bold" textAlign="center">
        {title}
      </Heading>
      <Icon boxSize={6} as={rightIcon} _hover={{cursor: "pointer"}}/>
      {/* Toggle {colorMode === 'light' ? 'Dark' : 'Light'} */}
    </Box>
  );
}