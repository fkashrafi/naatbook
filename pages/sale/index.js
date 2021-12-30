import React, { useState, useEffect } from 'react';
import {
    Heading,
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
    Select,
    Stack,
    FormControl,
    FormLabel,
    Input,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import uniqBy from 'lodash.uniqby';
import SidebarWithHeader from '../../component/sidebar';
import { toWords } from 'number-to-words'
import moment from 'moment';
import { jsPDF } from "jspdf";
import 'jspdf-autotable'

const TableHead = [
    // 'Sr No.',
    'Book Name',
    'Rate',
    'Qty',
    'Discount',
    'Amount',
];
const nullData = {
    book_name: '',
    price: '',
    qty: '',
    discount: '',
    amount: ''
};
export default function Home({
    children,
}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [data, setData] = useState(
        [nullData]
    );

    const [invoice_num, setInvoice] = useState('');
    const [date, setDate] = useState(`${moment().format('DD/MM/YYYY')}`);
    const [c_name, setC_name] = useState('');
    const [c_number, setC_contact] = useState('');

    const [bookList, setBookList] = useState([]);
    const [saleList, setSaleList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSales();
        getBooks();
    }, []);

    const getSales = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/sales', { method: 'GET', });
            const responce = await res.json();
            setSaleList(responce);
            setInvoice(`00${(responce.length) + 1}`)
        } catch (error) {

        } finally {
            setLoading(false);
        }
    }

    const getBooks = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/books', { method: 'GET', });
            const responce = await res.json();
            setBookList(responce);
        } catch (error) {

        } finally {
            setLoading(false);
        }
    }








    const handleAddRow = () => {
        let dataArr = [...data];
        if (dataArr.length < 5) {
            dataArr.push({ ...nullData });
            setData(uniqBy(dataArr, '_id'));
        }
    }
    const handleAddRemove = (index) => {
        let dataArr = [...data];
        if (dataArr.length > 1) {
            if (index > -1) {
                dataArr.splice(index, 1);
                console.log("handleAddRemove", dataArr);
                setData(uniqBy(dataArr, '_id'));
            }
        } else {
            setData([nullData]);
        }
    }

    const onChangeSelect = (v, item, ind) => {
        let dataArr = [...data];
        const bname = bookList.find(({ book_name }) => book_name === v);
        let stock = bname.inStock > 0 ? '1' : '0'

        dataArr[ind] = {
            ...dataArr[ind],
            ...bname,
            qty: stock,
            amount: ((bname.price) * (stock) - item.discount)
        }
        setData(uniqBy(dataArr, '_id'));
    }

    const sum = (arr, key) => {
        return arr.reduce((a, b) => a + (b[key] || 0), 0);
    }
    async function updateBooksHandler(enterMeetupData) {
        const responce = await fetch('/api/books', {
            method: 'PUT',
            body: JSON.stringify(enterMeetupData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await responce.json();
        //await responce 
    }

    async function addSalesHandler(enterMeetupData) {
        const responce = await fetch('/api/sales', {
            method: 'POST',
            body: JSON.stringify(enterMeetupData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await responce.json();
        //await responce 
        console.log("[addSalesHandler]", data);
    }

    const handleSubmit = async () => {
        let salesData = {
            c_name,
            c_number,
            date,
            invoice_num,
            book_list: data
        }
        data.forEach(element => {
            let {
                author,
                book_name,
                inStock,
                price,
                qty,
                _id
            } = element;

            let newData = {
                author,
                book_name,
                inStock: inStock - qty,
                price,
                _id
            }



            updateBooksHandler(newData);


        });
        addSalesHandler(salesData);
        pdfPrint();
    }
    const pdfPrint = () => {
        const doc = new jsPDF({
            orientation: "p",
            // unit: "in",
            // format: [4, 2]
        });
        var imgData = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMANSUoLyghNS8rLzw5NT9QhVdQSUlQo3V7YYXBqsvIvqq6t9Xw///V4v/mt7r////////////O///////////////bAEMBOTw8UEZQnVdXnf/cutz////////////////////////////////////////////////////////////////////AABEIAKUBjQMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAAAwQFAgEG/8QAOxAAAgICAAQDBAgEBQUBAAAAAQIAAwQREiExUQUTQSIyYXEUI0JSgZGhsRUzcsGCktHh8CRDU2LxNP/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDTiIgIiICIiAiIgIiICIiAiIgIiICI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"

        doc.addFont("arabicfont/NafeesNastaleeq.ttf", "NafeesNastaleeq", "regular");
        doc.setFont("arial");
        var col = TableHead;
        var rows = [];

        data.forEach(({ book_name, price, qty, discount, amount }) => {
            var temp = [book_name, price, qty, discount, amount];
            rows.push(temp);
        });
        doc.addImage(imgData, "JPEG", 80, 10, 40, 20, 'center');
        doc.addImage(imgData, "JPEG", 80, 10, 40, 20, 'center');
        doc.setFontSize(10);
        doc.text(10, 20, `Date ${date}`, 'left');
        // doc.text(100, 20, 'Naat Research Center', 'center');
        doc.text(200, 20, `Invoice No. ${invoice_num}`, 'right');
        doc.text(10, 30, `Name ${c_name}`, 'left');
        doc.text(200, 30, `Contact. ${c_number}`, 'right');
        doc.setFont("Amiri");
        doc.autoTable(col, rows, { startY: 35 }, { fillColor: '#bde4d1', textColor: '#333333', fontStyle: 'Amiri' }, { fillColor: '#bde4d1', textColor: '#333333', fontStyle: 'Amiri' });
        doc.setFont("arial");
        doc.text(20, 90, `${toWords(sum(data, 'amount'))} only.`, 'left');
        doc.text(180, 90, `${sum(data, 'amount')} /=`, 'right');
        doc.text(20, 110, 'Expo Center, International Book Fair 2021', 'left');
        doc.text(20, 100, `“This document is computer generated and does not require the signature.“`, 'left');


        // doc.text("Hello world!", 20, 20);
        // doc.text("This is client-side Javascript, pumping out a PDF.", 20, 30);
        // doc.output('save', 'filename.pdf');
        doc.autoPrint();
        doc.output('dataurlnewwindow');

    }
    return (
        <SidebarWithHeader>

            {loading ? <Text>Loading...</Text> :
                <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
                    <Button
                        onClick={pdfPrint}
                        colorScheme='teal'
                        variant='solid' >
                        print
                    </Button>
                    <br />
                    <Flex
                    // align={'center'}
                    // justify={'center'}
                    >
                        <div id="divToPrint">
                            <Box
                                w="full"
                                rounded={'lg'}
                                bg={useColorModeValue('white', 'gray.700')}
                                boxShadow={'lg'}
                                p={8}>

                                <Stack
                                    align='center'
                                    justify='center'
                                    spacing={4}>
                                    <Heading as='h2' size='xl'>Naat Research Center</Heading>
                                    <Heading as='h4' size='md'>International Book Fair 2021</Heading>
                                </Stack>
                                <HStack
                                    justify='space-between'
                                    spacing={4}>
                                    <Text>Date: {date}</Text>
                                    <Text>Invoice: {invoice_num}</Text>
                                </HStack>
                                <br />
                                <HStack
                                    justify='space-between'
                                    spacing={4}>
                                    <FormControl id="name">
                                        {/* <FormLabel>Name</FormLabel> */}
                                        <Input
                                            onChange={e => setC_name(e.target.value)}
                                            variant='filled'
                                            type="text"
                                            placeholder="Good name"
                                        />
                                    </FormControl>
                                    <FormControl id="contact">
                                        {/* <FormLabel>Contact</FormLabel> */}
                                        <Input
                                            onChange={e => setC_contact(e.target.value)}
                                            variant='filled' maxLength={11} minLength={11} type="number" placeholder="03001234567" />
                                    </FormControl>
                                </HStack>


                                <Stack
                                    spacing={4}>

                                    <Table
                                        // bg={useColorModeValue('white', 'gray.700')}
                                        variant='simple'>
                                        <Thead>
                                            <Tr>
                                                <Th>
                                                    {/* <Heading as='h4' size='sm'>Book List</Heading> */}
                                                </Th>
                                            </Tr>
                                            <Tr>
                                                {TableHead.map((tableHead, index) => <Th key={`${index}${tableHead}`}>
                                                    <Heading as='h4' size='sm'>{tableHead}</Heading>
                                                </Th>)}
                                            </Tr>
                                        </Thead>
                                        {
                                            <Tbody>
                                                {data.map((item, ind) => <Tr key={`${ind}`}>
                                                    <Td>
                                                        <Select placeholder='Select option'
                                                            onChange={e => onChangeSelect(e.target.value, item, ind)}
                                                            value={data.book_name}>
                                                            {bookList.map((v, i) =>
                                                                <option
                                                                    key={v._id}
                                                                    value={v.book_name}
                                                                >{v.book_name}</option>
                                                            )}
                                                        </Select>
                                                    </Td>
                                                    <Td>
                                                        <Input
                                                            value={item.price}
                                                            variant='filled' disabled type="number" placeholder="Rate eg. 123" />
                                                    </Td>
                                                    <Td>
                                                        <Input
                                                            value={item.qty}
                                                            onBlur={
                                                                e => {
                                                                    console.log("object", e.target.value, item.inStock);
                                                                    data[ind].qty = (+(item.inStock) >= +(e.target.value)) ?
                                                                        e.target.value : item.inStock
                                                                    data[ind].amount = ((item.price) * (data[ind].qty) - item.discount)
                                                                    setData([...data])

                                                                }
                                                            }
                                                            onChange={e => {
                                                                data[ind].qty = e.target.value
                                                                data[ind].amount = ((item.price) * (data[ind].qty) - item.discount)
                                                                setData([...data])
                                                            }}
                                                            variant='filled' type="number" placeholder="qty eg. 123" />
                                                        {(item.inStock <= 5) && <Text>In stock {item.inStock}</Text>}
                                                    </Td>
                                                    <Td>
                                                        <Input
                                                            value={item.discount}
                                                            onChange={e => {
                                                                data[ind].discount = e.target.value;
                                                                data[ind].amount = ((item.price) * (item.qty) - data[ind].discount)

                                                                setData([...data])
                                                            }}
                                                            variant='filled' type="number" placeholder="discount eg. 123" />
                                                    </Td>
                                                    <Td>
                                                        <Input
                                                            value={((item.price) * (item.qty) - item.discount)}
                                                            variant='filled' disabled type="number" placeholder="discount eg. 123" />
                                                    </Td>
                                                    <Td>
                                                        <Button
                                                            leftIcon={<AddIcon />}
                                                            colorScheme='teal' mr='2' onClick={handleAddRow}></Button>

                                                    </Td>
                                                    <Td>
                                                        <Button
                                                            leftIcon={<DeleteIcon />}
                                                            colorScheme='red' onClick={() => handleAddRemove(ind)}></Button>
                                                    </Td>
                                                </Tr>)}
                                            </Tbody>
                                        }
                                        {sum(data, 'amount') > 0 &&
                                            <Tfoot>
                                                <Tr>
                                                    <Th>Total</Th>
                                                    <Th></Th>
                                                    <Th></Th>
                                                    <Th></Th>
                                                    <Th>{sum(data, 'amount')}</Th>
                                                    {/* <Th>{[nullData].reduce((acc, obj)=>acc+((obj.rate) * (obj.qty) - obj.discount))}</Th> */}
                                                </Tr>
                                            </Tfoot>
                                        }
                                    </Table>
                                    <Box>
                                        <Text>
                                            {sum(data, 'amount') > 0 && toWords(sum(data, 'amount'))}
                                        </Text>
                                    </Box>
                                    <Box minW="full" maxW="full">
                                        <Button
                                            onClick={handleSubmit}
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
                            </Box>
                        </div>
                    </Flex>
                </Box>}
        </SidebarWithHeader>
    );
}