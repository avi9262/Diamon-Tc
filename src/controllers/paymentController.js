const axios = require('axios');
import connection from "../config/connectDB"; // Import your database connection

// Function to generate a random order number
function generateOrderNumber() {
    // Implement your logic to generate a random order number here
    return '2022' + Math.floor(Math.random() * 100000000); // Example: Generate a random 10-digit order number starting with '2022'
}

// Function to generate signature
function generateSign(params, secretkey) {
    // Sort the parameters by key
    const sortedParams = Object.keys(params).sort();
    
    // Construct the string to be signed
    const signString = sortedParams.reduce((acc, key) => {
        if (key !== 'sign' && key !== 'sign_type') {
            acc.push(`${key}=${params[key]}`);
        }
        return acc;
    }, []).join('&');
    
    // Append the secret key
    const signStrWithKey = signString + '&key=' + secretkey;
    
    // Generate the MD5 hash
    const signature = require('crypto').createHash('md5').update(signStrWithKey).digest('hex');
    
    return signature;
}

// Function to create the order
async function createOrder(req, res) {
    try {
        const { customer_mobile, user_token, amount, redirect_url, remark1, remark2 } = req.body;

        // Generate a random order number
        const mch_order_no = generateOrderNumber();

        // Define your parameters
        const params = {
            mch_id: '888168666', // Replace with your actual merchant ID
            mch_order_no: mch_order_no,
            mch_return_msg: remark1, // Using remark1 for mch_return_msg
            notify_url: 'https://9987co.in/sunpaynotify', // Using redirectUrl for notify_url
            page_url: 'https://9987co.in/wallet/recharge', // Using a default page_url
            pay_type: '102',
            trade_amount: amount,
            goods_name: remark2, // Using remark2 for goods_name
            order_date: new Date().toISOString().replace('T', ' ').substring(0, 19), // Using current date and time
            version: '1.0', // Check if this should be fixed at '1.0'
            sign_type: 'MD5'
        };

        // Generate the signature
        const apiKey = 'a4e07f677cbc41679d88d3cbb9517686'; // Replace with your actual merchant private key
        params.sign = generateSign(params, apiKey);

        // Make the POST request
        const response = await axios.post('https://pay.sunpayonline.xyz/pay/web', new URLSearchParams(params).toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        // Handle the response
        const responseData = response.data; // Axios automatically parses the response
        console.log('Response data:', responseData);
        if (responseData.respCode === 'SUCCESS' && responseData.payInfo) {
            console.log('PayInfo URL:', responseData.payInfo);
            
            // Insert data into the database
            await insertIntoDatabase(mch_order_no, customer_mobile, amount, responseData.payInfo); // Insert into database

            // Send the payment URL back to the frontend
            res.json({ paymentUrl: responseData.payInfo });
        } else {
            console.error('Payment request failed. Response:', responseData);
            throw new Error(`Payment request failed. Response: ${JSON.stringify(responseData)}`);
        }
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).send('Error creating order: ' + error.message);
    }
}

// Function to insert data into the database
async function insertIntoDatabase(order_id, customer_mobile, amount, paymentUrl) {
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
    createOrder,
};
