import express from "express";
import dotenv from "dotenv";
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { connect } from "./config/database.js";
import route from "./routes/index.route.js";

// Initialize dotenv
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`));

// Connect to database
connect();

// Initialize routes
route(app);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
