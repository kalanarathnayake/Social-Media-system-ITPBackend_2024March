const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors()); //cors origin
app.use(express.json());
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('Social Media Web Services up and running');
})

connectMongoDB().then(() => console.log("MongoDB connected")).catch(err => console.log(err));

async function connectMongoDB() {
  await mongoose.connect('mongodb+srv://gajabaProj:gajabaProj@cluster0.4nsfsfa.mongodb.net/?retryWrites=true&w=majority');
  // await mongoose.connect('mongodb+srv://GajabaDB:GajabaDB@cluster0.7rzxpnk.mongodb.net/?retryWrites=true&w=majority');
}

app.use('/user', require('./route/signin.route'))

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
})