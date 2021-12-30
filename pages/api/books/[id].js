import dbConnect from '../../../lib/dbConnect'
import Books from '../../../models/books'

export default async function handler(req, res) {
    const { method } = req;

    const db = await dbConnect();

    switch (method) {
        case 'GET':
            try {
                const { id } = req.params;
                let books = await Books.find(id);
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