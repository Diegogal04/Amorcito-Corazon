if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverRide = require('method-override')


const initializePassport = require('./passport-config');
initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)




const app = express();
const PORT = 3000;

const users = [];

app.use(express.static(__dirname + '/views'));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRETE,
    resave: false,
    saveUninitialized: false
}))
app.use(methodOverRide('_method'))

app.use(passport.initialize())
app.use(passport.session())

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', checkAuth, (req, res) => {
    res.render('index.ejs', { name: req.user.name })
})

app.get('/login', checkNotAuth, (req, res) => {
    res.render('login.ejs');
});

app.get('/register', checkNotAuth, (req, res) => {
    res.render('register.ejs')
})

app.get('/logline', checkAuth, (req, res) => {
    res.render('logline.ejs')
})

app.get('/teaser', checkAuth, (req, res) => {
    res.render('teaser.ejs')
})

app.get('/sinopsis', checkAuth, (req, res) => {
    res.render('sinopsis.ejs')
})

app.get('/pedro', checkAuth, (req, res) => {
    res.render('pedro.ejs')
})

app.get('/equipo', checkAuth, (req, res) => {
    res.render('equipo.ejs')
})

app.get('/contenido', checkAuth, (req, res) => {
    res.render('contenido.ejs')
})

app.post('/login', checkNotAuth, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.post('/register', checkNotAuth, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
    console.log(users)
})

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

function checkAuth(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    } 
        res.redirect('/login')
    }


function checkNotAuth(req, res, next) {
    if (req.isAuthenticated()) {
       return res.redirect('/')
    }
    next()
}

app.listen(PORT, () => {
    console.log(`Server up and running on port ${PORT}`)
})