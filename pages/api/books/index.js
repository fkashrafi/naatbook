import dbConnect from '../../../lib/dbConnect'
import Books from '../../../models/books'

export default async function handler(req, res) {
    const { method } = req;


    const db = await dbConnect();

    switch (method) {
        case 'GET':
            try {
                let books = await Books.find();
                return res.status(200).json(books);
            } catch (error) {
                res.status(400).send(error.message);
            }
            break
        case 'POST':
            try {
                const {
                    book_name,
                    inStock,
                    inStockArr,
                    author,
                    price
                } = req.body;
                const books = await Books.create({
                    book_name,
                    inStock,
                    inStockArr,
                    author,
                    price
                });
                return res.status(200).json(books);
            } catch (error) {
                res.status(400).send(error.message);
            }
            break
        case 'PUT':
            try {
                const {
                    _id,
                    author,
                    book_name,
                    inStock,
                    inStockArr,
                    price,
                } = req.body;
                let filter = { _id };
                let update = {
                    author, book_name, book_name, price, inStock, inStockArr,
                }
                const books = await Books.findOneAndUpdate(
                    filter,
                    update
                );
                return res.status(200).json(books);
            } catch (error) {
                res.status(400).send(error.message);
            }
            break

        default:
            res.status(400).json({ success: false })
            break
    }
}