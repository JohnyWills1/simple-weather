import Head from "next/head";
import styles from "../styles/Home.module.css";
import {
	Box,
	Button,
	Stack,
	Icon,
	Flex,
	Heading,
	Grid,
	Input,
	InputGroup,
	InputRightElement,
	IconButton,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { SearchIcon } from "@chakra-ui/icons";
import { TiWeatherDownpour, TiWeatherSnow, TiWeatherStormy, TiWeatherWindy, TiWeatherSunny } from "react-icons/ti";
import { motion } from "framer-motion";

export default function Home() {
	const [data, setData] = useState(null);
	const [uom, setUOM] = useState("metric");
	const [dest, setDest] = useState("");
	const [finalDest, setFinalDest] = useState("Tokyo");
	const [error, setError] = useState(null);

	useEffect(() => {
		const getWeather = async () => {
			try {
				const response = await axios.get(
					"http://api.openweathermap.org/data/2.5/weather?q=" + finalDest + "" + "&units=" + uom
				);
				setData(response.data);
				setError(null);
				console.log(response.data);
			} catch (error) {
				setError("An error has occurred please try a different search term!");
			}
		};
		getWeather();
	}, [uom, finalDest]);

	const MotionBox = motion.custom(Box);

	return (
		<div className={styles.container}>
			<Head>
				<title>Simple Weather</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main className={styles.main}>
				<Stack mb='50px' isInline>
					<MotionBox whileHover={{ scale: 1.2, y: "-20px" }} p='10px' backgroundColor='#44464A' borderRadius='9999px'>
						<Icon as={TiWeatherSunny} color='white' w='40px' h='40px' />
					</MotionBox>
					<MotionBox whileHover={{ scale: 1.2, y: "-20px" }} p='10px' backgroundColor='#44464A' borderRadius='9999px'>
						<Icon as={TiWeatherDownpour} color='white' w='40px' h='40px' />
					</MotionBox>
					<MotionBox whileHover={{ scale: 1.2, y: "-20px" }} p='10px' backgroundColor='#44464A' borderRadius='9999px'>
						<Icon as={TiWeatherSnow} color='white' w='40px' h='40px' />
					</MotionBox>
					<MotionBox whileHover={{ scale: 1.2, y: "-20px" }} p='10px' backgroundColor='#44464A' borderRadius='9999px'>
						<Icon as={TiWeatherStormy} color='white' w='40px' h='40px' />
					</MotionBox>
					<MotionBox whileHover={{ scale: 1.2, y: "-20px" }} p='10px' backgroundColor='#44464A' borderRadius='9999px'>
						<Icon as={TiWeatherWindy} color='white' w='40px' h='40px' />
					</MotionBox>
				</Stack>

				<Box bgColor='#272C35' p={5} borderRadius='20px' zIndex='1' color='white' overflow='hidden'>
					<Heading>Simple Weather</Heading>
					<Flex align='center' flexDirection='column'>
						<Stack isInline>
							<Button size='xs' backgroundColor='#44464A' onClick={() => setUOM("imperial")}>
								°F
							</Button>
							<Button size='xs' backgroundColor='#44464A' onClick={() => setUOM("metric")}>
								°C
							</Button>
						</Stack>

						<InputGroup mt='10px' size='md'>
							<Input placeholder='Enter any city!' onChange={(e) => setDest(e.target.value)} />
							<IconButton colorScheme='blue' h='40px' icon={<SearchIcon />} onClick={() => setFinalDest(dest)} />
						</InputGroup>
						{error && <p color='red'>{error}</p>}
					</Flex>
				</Box>

				{data ? (
					<>
						<Heading color='white' mt='50px'>
							{data.name}
						</Heading>
						<Grid templateColumns='repeat(3, 1fr)' mt='50px' gap={6}>
							<Box bgColor='#44464A' p={5} borderRadius='20px' color='white'>
								<Flex flexDirection='column' justify='center' align='center'>
									<Heading size='lg'>Temperature</Heading>
									<Box fontSize='18px' mt='10px' fontSize='50px'>
										{data.main.temp} {uom === "imperial" ? "°F" : "°C"}
									</Box>
								</Flex>
							</Box>

							<Box bgColor='#44464A' p={5} borderRadius='20px' color='white'>
								<Flex flexDirection='column' justify='center' align='center'>
									<Heading size='lg'>Min Temperature</Heading>
									<Box fontSize='18px' mt='10px' fontSize='50px'>
										{data.main.temp_min} {uom === "imperial" ? "°F" : "°C"}
									</Box>
								</Flex>
							</Box>

							<Box bgColor='#44464A' p={5} borderRadius='20px' color='white'>
								<Flex flexDirection='column' justify='center' align='center'>
									<Heading size='lg'>Max Temperature</Heading>
									<Box fontSize='18px' mt='10px' fontSize='50px'>
										{data.main.temp_max} {uom === "imperial" ? "°F" : "°C"}
									</Box>
								</Flex>
							</Box>

							<Box bgColor='#44464A' p={5} borderRadius='20px' color='white'>
								<Flex flexDirection='column' justify='center' align='center'>
									<Heading size='lg'>Feels Like</Heading>
									<Box fontSize='18px' mt='10px' fontSize='50px'>
										{data.main.feels_like} {uom === "imperial" ? "°F" : "°C"}
									</Box>
								</Flex>
							</Box>

							<Box bgColor='#44464A' p={5} borderRadius='20px' color='white'>
								<Flex flexDirection='column' justify='center' align='center'>
									<Heading size='lg'>Humidity</Heading>
									<Box fontSize='18px' mt='10px' fontSize='50px'>
										{data.main.humidity} %
									</Box>
								</Flex>
							</Box>
						</Grid>
					</>
				) : (
					<Box mt={8} color='white'>
						Loading Data
					</Box>
				)}
			</main>
			{/* 
			<footer className={styles.footer}>
				<a
					href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
					target='_blank'
					rel='noopener noreferrer'>
					Powered by <img src='/vercel.svg' alt='Vercel Logo' className={styles.logo} />
				</a>
			</footer> */}
		</div>
	);
}
