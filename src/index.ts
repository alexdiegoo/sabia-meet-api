import dotenv from 'dotenv';

import express from 'express';
import helmet from 'helmet';


import routes from "./routes/index";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
    console.log(`Server is runing on port ${PORT}`);
})