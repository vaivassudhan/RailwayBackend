const express = require('express');
const bodyParser = require('body-parser'); 
const cors = require('cors');


const userRouter = require("./routes/user.routes");
const adminRouter = require("./routes/admin.routes");

const errorLogger = require("./utils/errorLogger");

const app = express();

const MAX_UPLOAD_SIZE = '10mb';
app.use(cors());

app.use(bodyParser.json({limit:MAX_UPLOAD_SIZE}));
app.use(bodyParser.urlencoded({extended:true, limit:MAX_UPLOAD_SIZE}))
app.use('/user',userRouter);
app.use('/admin',adminRouter);
app.use(errorLogger);


const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`Server is running on port ${PORT}`);