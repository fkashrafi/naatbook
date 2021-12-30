import React, { useEffect, useState } from 'react';
import {
    IconButton,
    Button,
    Avatar,
    Box,
    CloseButton,
    Flex,
    HStack,
    VStack,
    Icon,
    useColorModeValue,
    Link,
    Drawer,
    DrawerContent,
    Text,
    useDisclosure,
    BoxProps,
    FlexProps,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Stack,
    FormControl,
    FormLabel,
    Input,
    Heading,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import SidebarWithHeader from '../../component/sidebar';
import moment from 'moment';

export default function Home({
    children,
}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [date, setDate] = useState(moment().format('DD-MMM-YY'))
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting, isSubmitSuccessful },
        reset
    } = useForm();
    const[loading,setLoading] = useState(false);



    function onSubmit(values) {
        try {
            addMeetupHandler({
                ...values,
                inStockArr: [`${date}/${values.inStock}`]
            });
        } catch (error) {

        } finally {
            // reset(
            //     {
            //         author: '',
            //         book_name: '',
            //         inStock: '',
            //         price: ''
            //     }
            // )
        }
    }

    async function addMeetupHandler(enterMeetupData) {
        try {
            setLoading(true);
            const responce = await fetch('/api/books', {
                method: 'POST',
                body: JSON.stringify(enterMeetupData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await responce.json();
            
        } catch (error) {
            
        }finally{
            location.reload();
        }
    }



    return (
        <SidebarWithHeader>
            <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
                <Flex
                // align={'center'}
                // justify={'center'}
                >
                    <Box
                        w="full"
                        rounded={'lg'}
                        bg={useColorModeValue('white', 'gray.700')}
                        boxShadow={'lg'}
                        p={8}>
                        <Heading>Add Book Form</Heading>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack
                                spacing={4}>

                                <HStack w="full">
                                    <Box minW="full" maxW="full">
                                        <FormControl id="book_name" isRequired>
                                            <FormLabel>Book Name</FormLabel>
                                            <Input
                                                variant='filled'
                                                type="text"
                                                placeholder="Book Name"
                                                id="book_name"
                                                {...register("book_name", {
                                                    required: "This is required",
                                                })}
                                            />
                                        </FormControl>
                                    </Box>
                                </HStack>
                                <HStack w="full">
                                    <Box minW="full" maxW="full">
                                        <FormControl id="author" isRequired>
                                            <FormLabel>Author Name</FormLabel>
                                            <Input
                                                variant='filled'
                                                type="text"
                                                id="author"
                                                {...register("author", {
                                                    required: "This is required",
                                                })}
                                                placeholder="Author Name"
                                            />
                                        </FormControl>
                                    </Box>
                                </HStack>
                                <HStack w="full">
                                    <Box minW="50%" maxW="full">
                                        <FormControl id="inStock" isRequired>
                                            <FormLabel>In Stock</FormLabel>
                                            <Input
                                                variant='filled'
                                                type="text"
                                                id="inStock"
                                                {...register("inStock", {
                                                    required: "This is required",
                                                })}
                                                placeholder="eg. 123" />
                                        </FormControl>
                                    </Box>
                                    <Box minW="50%" maxW="full">
                                        <FormControl id="price" isRequired>
                                            <FormLabel>Price</FormLabel>
                                            <Input variant='filled'
                                                type="text"
                                                id="price"
                                                {...register("price", {
                                                    required: "This is required",
                                                })}
                                                placeholder="eg. 123" />
                                        </FormControl>
                                    </Box>
                                </HStack>
                                <Box minW="full" maxW="full">
                                    <Button
                                    disabled={loading}
                                        type="submit"
                                        bg={'blue.400'}
                                        minW="full" maxW="full"
                                        color={'white'}
                                        _hover={{
                                            bg: 'blue.500',
                                        }}>
                                        Submit
                                    </Button>
                                </Box>
                            </Stack>
                        </form>
                    </Box>
                </Flex>
            </Box>
        </SidebarWithHeader>
    );
}
