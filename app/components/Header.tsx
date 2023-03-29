import { Box, Heading } from "@chakra-ui/react";

export default function Header(){
  return (
    <Box display={"flex"} flexDir={"column"} justifyContent={"center"} alignItems={"center"} h={"60px"} w={"100%"}>
      <Heading as="h1" size="xl" color="white" fontWeight="bold" textAlign="center">
        Albumdle
      </Heading>
    </Box>
  );
}