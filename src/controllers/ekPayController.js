const ekPayHandler = (req, res) => {
    // Render the EJS file for the new page
    res.render('wallet/ekpay');
};

const usdtHandler = (req, res) => {
    // Render the EJS file for the new page
    res.render('wallet/usdt');
};

const arkpayHandler = (req, res) => {
    // Render the EJS file for the new page
    res.render('wallet/arkpay');
};

const sunpaybHandler = (req, res) => {
    // Render the EJS file for the new page
    res.render('wallet/sunpayb');
};

const usdtpayHandler = (req, res) => {
    // Render the EJS file for the new page
    res.render('wallet/usdtpay');
};

const usdtoutHandler = (req, res) => {
    // Render the EJS file for the new page
    res.render('wallet/usdtout');
};

const ekqrHandler = (req, res) => {
    // Render the EJS file for the new page
    res.render('wallet/ekqrusdt');
};


module.exports = {
    ekPayHandler,
    usdtHandler,
    usdtpayHandler,
    usdtoutHandler,
    ekqrHandler,
    arkpayHandler,
    sunpaybHandler
    
};
