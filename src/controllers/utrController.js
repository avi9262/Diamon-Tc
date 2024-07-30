import connection from '../config/connectDB';

const saveUTR = async (req, res) => {
  try {
    const { utrNumber, orderId } = req.body; // Extracting UTR number and order ID from the request

    const sql = 'UPDATE recharge SET utr_number = ? WHERE id_order = ?'; // Assuming 'recharge' table has 'utr_number' and 'id_order' columns

    const [result] = await connection.execute(sql, [utrNumber, orderId]);

    res.status(200).json({ message: 'UTR number saved successfully!' });
  } catch (err) {
    console.error('Error saving UTR number:', err);
    res.status(500).json({ error: 'Error saving UTR number' });
  }
};

export { saveUTR };