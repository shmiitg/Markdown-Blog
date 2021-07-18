const express = require('express');
const mongoose = require('mongoose');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const Article = require('./models/article');
const articleRouter = require('./routes/articles');
const methodOverride = require('method-override');

const port = process.env.PORT || 3000;
const app = express();

//connect to mongodb
const url = 'mongodb://localhost:27017/blog';
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log('Connection successful');
}).catch((err) => {
    console.log(`No connection: ${err}`);
});

app.set('view engine', 'ejs');
app.use(expressLayout);
app.set('views', path.join(__dirname + '/views'));
app.use(express.urlencoded({ extended: false }));

app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
    //sort articles from new to old
    const articles = await Article.find().sort({ createdAt: -1 })
    res.render('articles/index', { articles: articles })
});

app.use('/articles', articleRouter);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});