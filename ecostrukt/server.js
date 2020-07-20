const express = require('express');
const app = express();
const server = app.listen(process.env.PORT || 5000);
app.use(express.static('public'));
