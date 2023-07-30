import Head from "next/head";
import styles from "../styles/Home.module.css";
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
  StackDivider,
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

export default function Home() {
  const [airport, setAirport] = useState("");
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
        setData(data);
      });
  }

  const Information = () => {
    return data ? (
      <Tabs m={20}>
            <TabList>
              <Tab>Weather</Tab>
              <Tab>Airport Information</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Card m={20}>
                  <CardHeader>
                    <Heading size="md">Weather Report</Heading>
                  </CardHeader>

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
                <Card m={20}>
                  <CardHeader>
                    <Heading size="md">Airport Information</Heading>
                  </CardHeader>

                  <CardBody>
                    <Stack divider={<StackDivider />} spacing="4">
                      <Box>
                        <Heading size="xs" textTransform="uppercase">
                          Overview
                        </Heading>
                        <Text pt="2" fontSize="sm">
                        </Text>
                      </Box>
                      <Box>
                        <Heading size="xs" textTransform="uppercase">
                          Runways
                        </Heading>
                        <Text pt="2" fontSize="sm">
                        </Text>
                      </Box>
                      <Box>
                        <Heading size="xs" textTransform="uppercase">
                        </Heading>
                        <Text pt="2" fontSize="sm">
                        </Text>
                      </Box>
                    </Stack>
                  </CardBody>
                </Card>
              </TabPanel>
            </TabPanels>
          </Tabs>
    ) : <></>
  }

  return (
    <ChakraProvider>
      <div className={styles.container}>
        <Head>
          <title>Go/No-Go Decision</title>
        </Head>

        <main>
          <Heading as="h1" size="3xl" mt={100} textAlign={"center"}>
            Go/No-Go Decision Support
          </Heading>
          <Text fontSize="xl" m={15} p={15} textAlign={"center"}>
            Supporting general aviation pilots in training in making an informed
            decision on whether conditions are safe to proceed with a flight
            (go) or if it is better to delay or cancel (no-go) based on a
            variety of factors.
          </Text>

          <Heading as="h2" size="xl" textAlign={"center"} m={15} mt={100}>
            Airport Search
          </Heading>
          <Text textAlign={"center"} fontSize="l" m={15}>
            Enter the airport's ICAO code
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
          <Center>
            <Button m={5} onClick={weatherLookup}>
              Search
            </Button>
          </Center>
          
          <Information />
        </main>
      </div>
    </ChakraProvider>
  );
}
