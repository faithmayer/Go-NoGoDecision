import Head from "next/head";
import styles from "../styles/Home.module.css";
import Airplane from "../components/airplane";
import { useState } from "react";

import {
  Button,
  ChakraProvider,
  Input,
  Heading,
  Text,
  Center,
  Card,
  CardHeader,
  CardBody,
  Stack,
  HStack,
  StackDivider,
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  Select,
} from "@chakra-ui/react";

export default function Home() {
  const [airport, setAirport] = useState("");
  const [visibility, setVisibility] = useState("");
  const [crosswind, setCrosswind] = useState("");
  const [wind, setWind] = useState("");
  const [ceiling, setCeiling] = useState("");
  const [precipitation, setPrecipitation] = useState("");

  const [data, setData] = useState(null);

  async function weatherLookup() {
    if (!airport) {
      alert("No airport given");
      return;
    }
    await fetch("/api/weather", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ airport }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          alert(data.message);
        } else {
          setData(data);
        }
      });
  }

  const Information = () => {
    return data ? (
      <Tabs ml={"4"}>
        <TabList>
          <Tab>Weather</Tab>
          <Tab>Airport Information</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Card>
              <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Overview
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      {data.weather.weather[0].description}
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Visibility
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      {data.weather.visibility}
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Wind
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      <p>Degrees: {data.weather.wind.deg}</p>
                      <p>Speed: {data.weather.wind.speed}</p>
                    </Text>
                  </Box>
                </Stack>
              </CardBody>
            </Card>
          </TabPanel>
          <TabPanel>
            <Card>
              <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Overview
                    </Heading>
                    <Text pt="2" fontSize="sm"></Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Runways
                    </Heading>
                    <Text pt="2" fontSize="sm"></Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase"></Heading>
                    <Text pt="2" fontSize="sm"></Text>
                  </Box>
                </Stack>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    ) : (
      <></>
    );
  };

  return (
    <ChakraProvider>
      <Head>
        <title>Go/No-Go Decision</title>
      </Head>
        <main>
          <Box mb={"24"} mt={"-8"}>
          <Center>
            <Airplane />
          </Center>
          <Heading
            as="h1"
            fontSize={"1.3em"}
            textAlign={"center"}
            transform={"rotate(-10deg)"}
            pl={"80px"}
            mt={"-150px"}
            color={"gray.700"}
          >
            Go/No-Go Decision Support
          </Heading>
          </Box>

          <HStack alignItems={"start"}>
            <Box
              flex={"1"}
              borderRight={"2px"}
              borderColor={"gray.300"}
              pr={"4"}
            >
              <Text textAlign={"center"} fontSize="l" m={15} fontWeight={"bold"}>
                Enter the airport's ICAO code:
              </Text>
              <Center>
                <Input
                  htmlSize={9}
                  width="auto"
                  variant="outline"
                  placeholder="ICAO Code"
                  textAlign={"center"}
                  value={airport}
                  onChange={(e) => {
                    setAirport(e.target.value);
                  }}
                />
              </Center>
              <Text textAlign={"center"} fontSize="l" m={15} fontWeight={"bold"}>
                Enter your personal minimums:
              </Text>
              <VStack>
              <HStack>
                <VStack>
                  <Text>Visibility (mi)</Text>
                  <Input
                    htmlSize={9}
                    placeholder="Ex: 2"
                    textAlign={"center"}
                    value={visibility}
                    onChange={(e) => {
                      setVisibility(e.target.value);
                    }}
                  />
                </VStack>
                <VStack>
                  <Text>Crosswind (kn)</Text>
                  <Input
                    htmlSize={9}
                    placeholder="Ex: 17"
                    textAlign={"center"}
                    value={crosswind}
                    onChange={(e) => {
                      setCrosswind(e.target.value);
                    }}
                  />
                </VStack>
                <VStack>
                  <Text>Wind (kn)</Text>
                  <Input
                    htmlSize={9}
                    placeholder="Ex: 17"
                    textAlign={"center"}
                    value={wind}
                    onChange={(e) => {
                      setWind(e.target.value);
                    }}
                  />
                </VStack>
              </HStack>
              <HStack>
                <VStack>
                  <Text>Ceiling (ft)</Text>
                  <Input
                    htmlSize={9}
                    placeholder="Ex: 10000"
                    textAlign={"center"}
                    value={ceiling}
                    onChange={(e) => {
                      setCeiling(e.target.value);
                    }}
                  />
                </VStack>
                <VStack>
                  <Text>Precipitation</Text>
                  <Select
                    placeholder="Select..."
                    value={precipitation}
                    onChange={(e) => {
                      setPrecipitation(e.target.value);
                    }}
                  >
                    <option>None</option>
                    <option>Drizzle is fine</option>
                    <option>No restrictions</option>
                  </Select>
                </VStack>
              </HStack>
              </VStack>
              <Center>
                <Button m={5} onClick={weatherLookup}>
                  Should I fly?
                </Button>
              </Center>
            </Box>
            <Box flex={"1"}>
              <Information />
            </Box>
          </HStack>
        </main>
    </ChakraProvider>
  );
}
