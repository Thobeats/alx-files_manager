
const express = require('express');
import getRoute from './routes';

const app = express();

const PORT = process.env.PORT || 5000;

getRoute(app);

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});

