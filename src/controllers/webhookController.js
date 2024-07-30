import connection from "../config/connectDB";

exports.handleWebhook = async (req, res) => {
    const { status, order_id, remark1 } = req.body;

    if (status === 'SUCCESS') {
        try {
            // Update recharge status to 1 where id matches order_id
            await connection.query(`UPDATE recharge SET status = 1 WHERE id_order = ?`, [order_id]);

            // Fetch recharge information based on order_id
            const [rechargeInfo] = await connection.query(`SELECT * FROM recharge WHERE id_order = ?`, [order_id]);

            // Update user's money and total_money in the 'users' table
            await connection.query('UPDATE users SET money = money + ?, total_money = total_money + ? WHERE phone = ? ', [rechargeInfo[0].money, rechargeInfo[0].money, rechargeInfo[0].phone]);

            return res.status(200).json({
                message: 'Successful application confirmation',
                status: true,
                data: rechargeInfo, // Corrected 'datas' to 'data'
            });
        } catch (error) {
            console.error('Error processing webhook:', error);
            return res.status(500).json({
                message: 'Internal server error',
                status: false,
                error: error.message // Include the actual error message
            });
        }
    } else {
        return res.status(400).json({
            message: `Invalid status: ${status}`,
            status: false,
        });
    }
};
