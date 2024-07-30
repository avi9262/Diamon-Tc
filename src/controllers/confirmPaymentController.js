import express from 'express';
import connection from '../config/connectDB';

const confirmPayment = async (req, res) => {
    try {
        const { amount, utr, phone } = req.query;

        // Generate random id_order
        const id_order = Math.floor(Math.random() * 1000000);

        // Get current date and time
        const today = new Date();
        const formattedDate = today.toISOString().slice(0, 19); // Format date and time as YYYY-MM-DD HH:MM:SS
        const timeInMillis = today.getTime(); // Get time in milliseconds

        // Insert data into the database
        const sql = `INSERT INTO recharge 
                     (id_order, transaction_id, phone, money, bmoney, type, status, today, url, time, utr_number) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await connection.execute(sql, [
            id_order,   // id_order
            0,          // transaction_id
            phone,      // phone
            amount,     // money
            amount,     // bmoney
            'upi',      // type
            0,          // status
            formattedDate, // today
            null,       // url
            timeInMillis, // time (in milliseconds)
            utr,        // utr_number
        ]);

        // Check if data was successfully inserted
        if (result && result.affectedRows === 1) {
            console.log('Payment details inserted successfully');
            // Send a response indicating success
            res.redirect('/wallet');
        } else {
            console.error('Failed to save payment information');
            // Send a response indicating failure
            res.status(500).send('Failed to save payment information');
        }
    } catch (error) {
        console.error('Error confirming payment:', error.message);
        console.error('Stack trace:', error.stack);
        // Send a response indicating failure
        res.status(500).send('An unexpected error occurred: ');
    }
};

const confirmPaymentUsdt = async (req, res) => {
    try {
        const { amount, utr, phone } = req.query;

        // Generate random id_order
        const id_order = Math.floor(Math.random() * 1000000);

        // Get current date and time
        const today = new Date();
        const formattedDate = today.toISOString().slice(0, 19); // Format date and time as YYYY-MM-DD HH:MM:SS
        const timeInMillis = today.getTime(); // Get time in milliseconds

        // Insert data into the database
        const sql = `INSERT INTO recharge 
                     (id_order, transaction_id, phone, money, bmoney, type, status, today, url, time, utr_number) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await connection.execute(sql, [
            id_order,   // id_order
            0,          // transaction_id
            phone,      // phone
            amount,     // money
            amount,     // bmoney
            'bank',     // type
            0,          // status
            formattedDate, // today
            null,       // url
            timeInMillis, // time (in milliseconds)
            utr,        // utr_number
        ]);

        // Check if data was successfully inserted
        if (result && result.affectedRows === 1) {
            console.log('Payment details inserted successfully');
            // Send a response indicating success
            res.redirect('/wallet');
        } else {
            console.error('Failed to save payment information');
            // Send a response indicating failure
            res.status(500).send('Failed to save payment information');
        }
    } catch (error) {
        console.error('Error confirming payment:', error.message);
        console.error('Stack trace:', error.stack);
        // Send a response indicating failure
        res.status(500).send('An unexpected error occurred: ');
    }
};

export { confirmPayment, confirmPaymentUsdt };