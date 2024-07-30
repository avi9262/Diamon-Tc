import connection from "../config/connectDB"; // Import your database connection

const handlePaymentNotification = async (req, res) => {
    try {
        // Extract parameters from the request body
        const { tradeResult, mchOrderNo } = req.body;

        // Validate the tradeResult to ensure payment success
        if (tradeResult !== "1") {
            throw new Error("Payment was not successful.");
        }

        // Update the status to 1 where id_order is equal to mchOrderNo
        const sqlUpdate = `UPDATE recharge SET status = 1 WHERE id_order = ?`;
        const [updateResult] = await connection.execute(sqlUpdate, [mchOrderNo]);

        // Check if any record was updated
        if (updateResult && updateResult.affectedRows > 0) {
            console.log("Payment details updated successfully");

            // Retrieve the mobile number and amount from the recharge table
            const sqlSelect = `SELECT phone, money FROM recharge WHERE id_order = ?`;
            const [selectResult] = await connection.execute(sqlSelect, [mchOrderNo]);

            // Check if any record was found
            if (selectResult && selectResult.length > 0) {
                const { phone, money } = selectResult[0];

                // Update the user balance in the users table
                const sqlUpdateUserBalance = `UPDATE users SET money = money + ? WHERE phone = ?`;
                await connection.execute(sqlUpdateUserBalance, [money, phone]);

                console.log("User balance updated successfully");

                // Send a success response
                res.send("success");
            } else {
                console.error("No record found for the given mchOrderNo");
                // Send a failure response
                res.status(404).send("No record found for the given mchOrderNo");
            }
        } else {
            console.error("No record found for the given mchOrderNo");
            // Send a failure response
            res.status(404).send("No record found for the given mchOrderNo");
        }
    } catch (error) {
        console.error("Error processing payment notification:", error);
        res.status(500).send("Error processing payment notification: " + error.message);
    }
};

module.exports = { handlePaymentNotification };
