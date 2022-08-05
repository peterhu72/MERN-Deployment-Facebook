const express = require("express");
const cors = require("cors")

require('dotenv').config()
const cookieParser = require('cookie-parser')

const app = express();
const port = 8000;


app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(cookieParser())

// connect to db
require("./server/config/mongoose.config");


require("./server/routes/user.routes")(app);
require("./server/routes/post.routes")(app);



app.listen( port, () => console.log(`Listening on port: ${port}`) );