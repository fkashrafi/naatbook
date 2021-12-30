import React, { useState,useEffect } from 'react';
import {
    Heading,
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
    Button,
    MenuDivider,
    MenuItem,
    MenuList,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
} from '@chakra-ui/react';
import {
    FiHome,
    FiTrendingUp,
    FiCompass,
    FiStar,
    FiSettings,
    FiMenu,
    FiBell,
    FiChevronDown,
} from 'react-icons/fi';
import { EditIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { IconType } from 'react-icons';
import { ReactText } from 'react';

import SidebarWithHeader from '../../component/sidebar';

const TableHead = [
    'Book Name',
    'Author',
    'In Stock',
    'Price',
    'Stock History',
    'Edit',
    'Edit Qty',
];


export default function BookList({
    children,
    // bookList
}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const[bookList,setBookList] = useState([]);
    const[loading,setLoading] = useState(true);
    //await responce 

    useEffect(()=>{
        getBooks()

    },[]);

    const getBooks = async() =>{
        try {
            
            const res = await fetch('/api/books', {method: 'GET',});
            const responce = await res.json();
            setBookList(responce);
        } catch (error) {
            
        }finally{
            setLoading(false);
        }
    }

    const router = useRouter();
    const handleEdit = (id) => {
        return
        router.push({
            pathname: `bookEdit/${id}`,
            asPath: "bookEdit/[_id]"
        });
    }

    const handleEditQty = (id) => {
        return
        router.push({
            pathname: `qtyOnly/${id}`,
        })
    };

    const printDocument = () => {
        window.print();
    }

    

    return (
        <SidebarWithHeader>
            <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
                <div id="divToPrint">
                    <Button
                        onClick={printDocument}
                        colorScheme='teal'
                        variant='solid' >
                        print
                    </Button>
                    <br />
                    {loading?
                    <Text>Loading...</Text>:null}
                    {bookList.length>0?<Table
                        bg={useColorModeValue('white', 'gray.700')}
                        variant='striped'>
                        <Thead>
                            <Tr>
                                {TableHead.map((tableHead, index) => <Th key={`${index}${tableHead}`}>
                                    <Heading as='h4' size='sm'>{tableHead}</Heading>
                                </Th>)}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {bookList?.map((
                                {
                                    _id,
                                    book_name,
                                    author,
                                    inStock,
                                    inStockArr,
                                    price
                                },
                                index) => <Tr key={`${_id}`}>
                                    <Td>{book_name}</Td>
                                    <Td>{author}</Td>
                                    <Td>{inStock}</Td>
                                    <Td>{price}</Td>
                                    <Td>{inStockArr.map(v => <b key={`${v}`}>{`${v},`}</b>)}</Td>
                                    <Td>
                                        <Button
                                            onClick={() => handleEdit(_id)}
                                            leftIcon={<EditIcon />}
                                            colorScheme='teal'
                                            variant='solid' >

                                        </Button>
                                    </Td>
                                    <Td>
                                        <Button
                                            onClick={() => handleEditQty(_id)}
                                            leftIcon={<EditIcon />}
                                            colorScheme='teal'
                                            variant='solid' >
                                            qty

                                        </Button>
                                    </Td>

                                </Tr>)}

                        </Tbody>
                    </Table>:null}
                </div>
            </Box>

        </SidebarWithHeader>
    );
}



// export const getStaticProps = async () => {
//     const res = await fetch('/api/books', {
//         method: 'GET',
//         // headers: {
//         //     'Content-Type': 'application/json'
//         // }
//     });
//     // const res = await fetch(`http://localhost:3000/api/books`);
//     const bookList = JSON.parse(JSON.stringify(res))
    
//     console.log("object BL",res);
//     console.log("object BL",bookList);
//     return {
//         props: {
//             bookList: []
//         },
//         revalidate: 1
//     }
// }
// naat-68wtkmm83-luvrnight-gmailcom.vercel.app