import { Image, Box } from '@chakra-ui/react';

export default function Index() {
  return (
    <Box display={"flex"} flexDir={"column"} justifyContent={"center"} alignItems={"center"} h={"100%"} w={"100%"}>
      <Box display={"flex"} flexDir={"column"} justifyContent={"center"} alignItems={"center"} h={"100vh"} w={"100vw"}>
        <Image src={"../../shoegazewithtext.png"} borderRadius={"2xl"} boxShadow={"lg"}/>
        
      </Box>
    </Box>
  );
}
