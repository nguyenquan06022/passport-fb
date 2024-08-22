const express = require('express')
const session = require('express-session')
const {engine} = require('express-handlebars')
const passport = require('passport')
const Strategy = require('passport-facebook').Strategy
const db = require('./connectDB')
const model = require('./Model')

var app = express()

app.use(session({
    secret : 'quanidol62'
}))
app.use(passport.initialize())
app.use(passport.session())

app.engine('.hbs',engine({
    extname: '.hbs'
}))

app.set('view engine','hbs')
app.set('views','./views')

db.connect()

app.get('/',(req,res) => {
    res.render('home')
})
app.get('/auth/facebook', passport.authenticate('facebook',));

app.get('/auth/facebook/cb', passport.authenticate('facebook', { 
    failureRedirect: '/' 
}), (req, res) => {
    let user = req.user
    res.json(user)
});

app.listen(5000,() => {
    console.log('server running...')
})

passport.use(new Strategy(
    {
        clientID:'1180957129864357',
        clientSecret:'616fb9582da23e6eadbbe51bd0b79e36',
        callbackURL:'https://passport-fb.onrender.com/auth/facebook/cb',
        profileFields:['email', 'gender', 'locale', 'displayName']
    },
    (accessToken, refreshToken, profile, done) => {
        console.log(profile)
        model.findOne({id : profile._json.id})
        .then(data => {
            if(!data) {
                const newUser = new model({
                    id : profile._json.id,
                    username : profile.displayName,
                    email : profile._json.email
                })
                newUser.save()
                .then(() => {return done(null,newUser)})
            }
            else return done(null,data)
        }).catch(err => {
            done(null)
        })
    }
));


passport.serializeUser((user,done) => {
    done(null,user.id)
})

passport.deserializeUser((id,done) => {
    model.findOne({id})
    .then(data => {
        if(!data) return done(null,false)
        else return done(null,data)
    }).catch(err =>{
       return done(null)
    })
})

