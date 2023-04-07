import { Box, Button, Heading, useColorMode } from "@chakra-ui/react";

export default function Header(){
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <Box display={"flex"} flexDir={"row"} justifyContent={"space-between"} alignItems={"center"} h={"60px"} w={"100%"}>
      <Button onClick={toggleColorMode} >Toggle {colorMode === 'light' ? 'Dark' : 'Light'}</Button>
      <Heading as="h1" size="xl" color="black" fontWeight="bold" textAlign="center">
        Albumdle
      </Heading>
      <Button onClick={toggleColorMode}>Toggle {colorMode === 'light' ? 'Dark' : 'Light'}</Button>
    </Box>
  );
}