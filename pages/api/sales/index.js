import dbConnect from '../../../lib/dbConnect'
import Sales from '../../../models/sales'

export default async function handler(req, res) {
    const { method } = req

    await dbConnect()

    switch (method) {
        case 'GET':
            try {
                // const users = await User.find({})
                // res.status(200).json({ success: true, data: users })
                const sales = await Sales.find();
                return res.status(200).json(sales);
            } catch (error) {
                res.status(400).send(error.message);
            }
            break
        case 'POST':
            try {
                const {
                    c_name,
                    c_number,
                    date,
                    invoice_num,
                    book_list
                } = req.body;
                const sales = await Sales.create({
                    c_name,
                    c_number,
                    date,
                    invoice_num,
                    book_list
                });
                return res.status(200).json(sales);
            } catch (error) {
                res.status(400).send(error.message);
            }
            break
        default:
            res.status(400).json({ success: false })
            break
    }
}