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
	Spinner,
	Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { SearchIcon } from "@chakra-ui/icons";
import { TiWeatherDownpour, TiWeatherSnow, TiWeatherStormy, TiWeatherWindy, TiWeatherSunny } from "react-icons/ti";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";

export default function Home() {
	const [data, setData] = useState(null);
	const [uom, setUOM] = useState("metric");
	const [dest, setDest] = useState("");
	const [finalDest, setFinalDest] = useState("Tokyo");
	const [error, setError] = useState(null);
	const [bgImage, setBgImage] = useState(null);
	const [lang, setLang] = useState("English");

	const getWeather = async () => {
		try {
			const response = await axios.get(
				"https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q=" +
					finalDest +
					"&appid=" +
					process.env.NEXT_PUBLIC_WEATHER_API_KEY +
					"&units=" +
					uom
			);
			setData(response.data);
			setError(null);
			// Get unsplash image
			const searchTerm = response.data.name;
			getImage(searchTerm);
		} catch (error) {
			setError("An error has occurred please try a different search term!");
		}
	};

	useEffect(() => {
		setData(null);
		getWeather();
		// setInterval(getWeather, 60000);
	}, [uom, finalDest]);

	const getImage = async (searchTerm) => {
		try {
			const response = await axios.get(
				"https://api.unsplash.com/search/photos?query=" + searchTerm + "&orientation=landscape&order_by=popular",
				{
					headers: {
						Authorization: "Client-ID " + process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
					},
				}
			);
			const randNum = Math.floor(Math.random() * 3);
			setBgImage(response.data.results[randNum]);
		} catch (error) {
			console.error(error);
		}
	};

	const onSubmit = ({ searchTermReq }) => {
		setFinalDest(searchTermReq);
	};

	const { register, handleSubmit, errors } = useForm();

	const MotionBox = motion.custom(Box);

	return (
		<div className={styles.container}>
			<Head>
				<title>Simple Weather</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<Flex
				className={styles.main}
				flexDirection='column'
				align='center'
				background='#272c35'
				fontFamily='Montserrat, sans-serif'
				minH={["150vh", "100vh"]}>
				<Flex position='relative' flexDirection='column' justify='center' align='center'>
					<Stack position='absolute' top={["-3%", "-4%", "-5%"]} spacing={["-3px", "10px"]} isInline>
						<MotionBox
							whileHover={{ scale: 1.2, y: "-25px" }}
							p='10px'
							background='linear-gradient(45deg,#f48c06,#ffba08)'
							borderRadius='9999px'>
							<Icon as={TiWeatherSunny} color='white' w='40px' h='40px' />
						</MotionBox>
						<MotionBox
							whileHover={{ scale: 1.2, y: "-25px" }}
							p='10px'
							background='linear-gradient(45deg,#4361ee,#4cc9f0)'
							borderRadius='9999px'>
							<Icon as={TiWeatherDownpour} color='white' w='40px' h='40px' />
						</MotionBox>
						<MotionBox
							whileHover={{ scale: 1.2, y: "-25px" }}
							p='10px'
							background='linear-gradient(45deg,#48cae4,#bde0fe)'
							borderRadius='9999px'>
							<Icon as={TiWeatherSnow} color='white' w='40px' h='40px' />
						</MotionBox>
						<MotionBox
							whileHover={{ scale: 1.2, y: "-25px" }}
							p='10px'
							background='linear-gradient(45deg,#e76f51,#e9c46a)'
							borderRadius='9999px'>
							<Icon as={TiWeatherStormy} color='white' w='40px' h='40px' />
						</MotionBox>
						<MotionBox
							whileHover={{ scale: 1.2, y: "-25px" }}
							p='10px'
							background='linear-gradient(45deg,#3f37c9,#7209b7)'
							borderRadius='9999px'>
							<Icon as={TiWeatherWindy} color='white' w='40px' h='40px' />
						</MotionBox>
					</Stack>
					<Box className={styles.glassMorph} p={5} borderRadius='20px' zIndex='1' color='white' w={["300px", "450px"]}>
						<Flex align='center' flexDirection='column'>
							<Stack justify='space-evenly' isInline>
								<Button
									size='sm'
									rounded='full'
									backgroundColor={uom === "imperial" ? "#3182ce" : "rgba(255, 255, 255, 0.4)"}
									onClick={() => setUOM("imperial")}>
									°F
								</Button>
								<Button
									size='sm'
									rounded='full'
									backgroundColor={uom === "metric" ? "#3182ce" : "rgba(255, 255, 255, 0.4)"}
									onClick={() => setUOM("metric")}>
									°C
								</Button>
								<Button
									size='sm'
									backgroundColor={lang === "English" ? "#3182ce" : "rgba(255, 255, 255, 0.4)"}
									rounded='full'
									onClick={() => setLang("English")}>
									A
								</Button>
								<Button
									size='sm'
									backgroundColor={lang === "Japanese" ? "#3182ce" : "rgba(255, 255, 255, 0.4)"}
									rounded='full'
									onClick={() => setLang("Japanese")}>
									あ
								</Button>
							</Stack>

							<form onSubmit={handleSubmit(onSubmit)}>
								<InputGroup mt='10px' size='md'>
									<Input
										name='searchTermReq'
										placeholder='Enter an area name!'
										ref={register({ required: true })}
										w={["200px", "250px"]}
										mr='10px'
										onChange={(e) => setDest(e.target.value)}
									/>
									<IconButton
										variant='outline'
										colorScheme='gray'
										h='40px'
										ml='5px'
										rounded='full'
										icon={<SearchIcon />}
										type='submit'
									/>
								</InputGroup>
								{errors.searchTermReq && <p color='red'>Please enter a search term!</p>}
							</form>
						</Flex>
					</Box>

					{data ? (
						<Box
							backgroundImage={bgImage && `url(${bgImage.urls.full})`}
							backgroundPosition='center'
							backgroundRepeat='no-repeat'
							backgroundSize='cover'
							p={5}
							w={["315px", "450px", "700px", bgImage && bgImage.width]}
							maxW='1000px'
							h={["1100px", "950px", "800px", bgImage && bgImage.height]}
							maxH={["1100px", "950px", "700px", "590px"]}
							mt='50px'
							borderRadius='20px'>
							<Heading
								color='white'
								mt='20px'
								className={styles.glassMorph}
								borderRadius='20px'
								fontSize='50px'
								textAlign='center'
								p='10px'
								w='fit-content'>
								{data.name}
							</Heading>

							<Grid templateColumns={["repeat(1,1fr)", "repeat(2,1fr)", "repeat(3, 1fr)"]} mt='20px' gap={[2, 6]}>
								<MotionBox
									className={styles.glassMorph}
									whileHover={{ scale: 1.08 }}
									p={5}
									borderRadius='20px'
									color='white'>
									<Flex flexDirection='column' justify='center' align='center'>
										<Heading size='md' fontFamily='Montserrat, sans-serif' opacity='0.8'>
											{lang === "Japanese" ? "温度" : "Temperature"}
										</Heading>
										<Box
											mt='10px'
											fontSize={["30px", "35px", "45px", "50px"]}
											fontWeight='900'
											textAlign='center'
											letterSpacing='2px'>
											{data.main.temp}°
										</Box>
									</Flex>
								</MotionBox>

								<MotionBox
									className={styles.glassMorph}
									whileHover={{ scale: 1.08 }}
									p={5}
									borderRadius='20px'
									color='white'>
									<Flex flexDirection='column' justify='center' align='center'>
										<Heading size='md' fontFamily='Montserrat, sans-serif' opacity='0.8'>
											{lang === "Japanese" ? "最低" : "Min Temperature"}
										</Heading>
										<Box
											mt='10px'
											fontSize={["30px", "35px", "45px", "50px"]}
											fontWeight='900'
											textAlign='center'
											letterSpacing='2px'>
											{data.main.temp_min}°
										</Box>
									</Flex>
								</MotionBox>

								<MotionBox
									className={styles.glassMorph}
									whileHover={{ scale: 1.08 }}
									p={5}
									borderRadius='20px'
									color='white'>
									<Flex flexDirection='column' justify='center' align='center'>
										<Heading size='md' fontFamily='Montserrat, sans-serif' opacity='0.8'>
											{lang === "Japanese" ? "最高" : "Max Temperature"}
										</Heading>
										<Box
											mt='10px'
											fontSize={["30px", "35px", "45px", "50px"]}
											fontWeight='900'
											textAlign='center'
											letterSpacing='2px'>
											{data.main.temp_max}°
										</Box>
									</Flex>
								</MotionBox>

								<MotionBox
									className={styles.glassMorph}
									whileHover={{ scale: 1.08 }}
									p={5}
									borderRadius='20px'
									color='white'>
									<Flex flexDirection='column' justify='center' align='center'>
										<Heading size='md' fontFamily='Montserrat, sans-serif' opacity='0.8'>
											{lang === "Japanese" ? "温度感覚" : "Feels Like"}
										</Heading>
										<Box
											mt='10px'
											fontSize={["30px", "35px", "45px", "50px"]}
											fontWeight='900'
											textAlign='center'
											letterSpacing='2px'>
											{data.main.feels_like}°
										</Box>
									</Flex>
								</MotionBox>

								<MotionBox
									className={styles.glassMorph}
									whileHover={{ scale: 1.08 }}
									p={5}
									borderRadius='20px'
									color='white'>
									<Flex flexDirection='column' justify='center' align='center'>
										<Heading size='md' fontFamily='Montserrat, sans-serif' opacity='0.8'>
											{lang === "Japanese" ? "湿度" : "Humidity"}
										</Heading>
										<Box
											mt='10px'
											fontSize={["30px", "35px", "45px", "50px"]}
											fontWeight='900'
											textAlign='center'
											letterSpacing='2px'>
											{data.main.humidity}°
										</Box>
									</Flex>
								</MotionBox>

								<MotionBox
									className={styles.glassMorph}
									whileHover={{ scale: 1.08 }}
									p={5}
									borderRadius='20px'
									color='white'>
									<Flex flexDirection='column' justify='center' align='center'>
										<Heading size='md' fontFamily='Montserrat, sans-serif' opacity='0.8'>
											{lang === "Japanese" ? "気圧" : "Pressure"}
										</Heading>
										<Box
											mt='10px'
											fontSize={["30px", "35px", "45px", "50px"]}
											fontWeight='900'
											textAlign='center'
											letterSpacing='2px'>
											{data.main.pressure} hPa
										</Box>
									</Flex>
								</MotionBox>
							</Grid>
							{bgImage && (
								<MotionBox
									mt='20px'
									color='white'
									className={styles.glassMorph}
									display='flex'
									flexDirection='column'
									w='fit-content'
									p='8px'
									borderRadius='10px'>
									<p>
										{lang === "Japanese" ? "現在情報：" : "Weather Data:"} {Date(data.dt)}
									</p>
									<p>
										📸 {bgImage.user.first_name} {bgImage.user.last_name}
									</p>
									<a href={bgImage.links.html}>🔗 Image Link</a>
								</MotionBox>
							)}
						</Box>
					) : (
						<Flex mt={8} color='white' align='center'>
							<Spinner
								thickness='4px'
								speed='0.65s'
								emptyColor='rgba(255, 255, 255, 0.4)'
								color='blue.500'
								size='xl'
							/>
						</Flex>
					)}
				</Flex>
			</Flex>
		</div>
	);
}
