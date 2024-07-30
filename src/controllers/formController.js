const axios = require('axios');
import connection from "../config/connectDB"; // Import your database connection
 // Import your database connection

class CreateOrderAPI {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }

    async createOrder(customerMobile, userToken, amount, orderId, redirectUrl, remark1, remark2) {
        const payload = new URLSearchParams();
        payload.append('customer_mobile', customerMobile);
        payload.append('user_token', userToken);
        payload.append('amount', amount);
        payload.append('order_id', orderId);
        payload.append('redirect_url', redirectUrl);
        payload.append('remark1', remark1);
        payload.append('remark2', remark2);

        try {
            const response = await axios.post(this.apiUrl, payload, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const data = response.data;

            if (response.status === 200 && data.status === true) {
                return data.result; // Return the result object containing orderId and payment_url
            } else {
                throw new Error(data.message || 'Unknown error');
            }
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }
}

// Handle form submission
const submitForm = async (req, res) => {
    try {

        // Extract payload data from the request body
        const { customer_mobile, user_token, amount, redirect_url, remark1, remark2 } = req.body;

        // Generate random order ID
        const order_id = generateOrderId();

        // Create an instance of CreateOrderAPI with the API URL
        const api = new CreateOrderAPI('https://arkpay.pepelottery.in/api/create-order');

        // Call the createOrder method with the payload data
        const orderResult = await api.createOrder(
            customer_mobile,
            user_token,
            amount,
            order_id,
            redirect_url,
            remark1,
            remark2
        );

        // Extract payment_url from the order result
        const paymentUrl = orderResult.payment_url;

        // Insert data into the database
        await insertIntoDatabase(order_id, customer_mobile, amount, paymentUrl); // Insert into database

        // Send the payment URL back to the frontend
        res.json({ paymentUrl: paymentUrl });
    } catch (error) {
        // Handle errors
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Function to generate random order ID
function generateOrderId() {
    // Implement your logic to generate a random order ID here
    return Date.now().toString() + Math.floor(Math.random() * 10000).toString();
}

// Function to insert data into the database
// Function to insert data into the database
async function insertIntoDatabase(order_id, customer_mobile, amount, paymentUrl, user) {
    try {
        // Parse the amount as a number
        amount = parseFloat(amount);

        // Calculate the bonus amount (10% of the provided amount)
        const bonusAmount = amount * 0.1;
        
        // Total recharge amount including bonus
        const totalAmount = amount + bonusAmount;

        // Get the current timestamp
        const timestamp = new Date().getTime(); // Returns the Unix timestamp in milliseconds

        const sql = `INSERT INTO recharge (id_order, transaction_id, phone, money, bmoney, type, status, today, url, time) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        // Adjust the values array according to your database schema
        const values = [order_id, '0', customer_mobile, totalAmount, amount, 'Upi', 2, new Date(), paymentUrl, timestamp];
        // Execute the SQL query
        await connection.query(sql, values); // Use execute function directly on connection
        
    } catch (error) {
        console.error('Error inserting into database:', error);
        throw error;
    }
}



module.exports = {
    submitForm,
};
