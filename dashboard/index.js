const express = require("express");
const url = require("url");
const path = require("path");
const Discord = require("discord.js");
const ejs = require("ejs");
const passort = require("passport");
const bodyParser = require("body-parser");
const Strategy = require("passport-discord").Strategy;
const passport = require("passport");

const config = require('../config.json');
const settings = require('./settings.json');

module.exports = (client, con) => {
    const app = express();
    const session = require('express-session');
    const MemoryStore = require('memorystore')(session);

    passort.serializeUser((user, done) => done(null, user));
    passort.deserializeUser((obj, done) => done(null, obj));

    passort.use(new Strategy({
        clientID: settings.config.clientID,
        clientSecret: settings.config.secret,
        callbackURL: settings.config.callback,
        scope: ["identify", "guilds", "guilds.join"]
    },
    (accessToken, refreshToken, profile, done) => {
        process.nextTick(() => done(null, profile));
    }
    ));

    app.use(session({
        store: new MemoryStore({ checkPeriod: 86400000 }),
        secret: `#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n`,
        resave: false,
        saveUninitialized: false
    }));

    app.use(passort.initialize());
    app.use(passort.session());

    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "./views"));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true,
    }));

    app.use(express.static(path.join(__dirname, "./public")));

    const checkAuth = (req, res, next) => {
        if(req.isAuthenticated()) return next();
        req.session.backURL = req.url;
        res.redirect("/login")
    }

    app.get("/login", (req, res, next) => {
        if(req.session.backURL) {
            req.session.backURL = req.session.backURL;
        } else if(req.headers.referer) {
            const parsed = url.parse(req.headers.referer);
            if(parsed.hostname === app.locals.domain) {
                req.session.backURL = parsed.path
            }
        } else {
            req.session.backURL = '/';
        }
        next();
    }, passort.authenticate("discord", { prompt: "none" }));

    app.get("/callback", passort.authenticate("discord", { failureRedirect: "/" }), async (req, res) => {
        let banned = false;
        if(banned) {
            req.session.destroy();
            res.json({ login: false, message: "Vous êtes banni ou blacklist", logout: true });
            req.logout();
        } else {
            res.redirect("/");
        }
    });

    app.get("/logout", function(req, res) {
        req.logout(function(err) {
            req.destroy();
            if (err) { return next(err); }
            res.redirect('/');
        });
    });

    app.get('/', (req, res) => {
        if(!req.isAuthenticated() || !req.user) return res.redirect("/login");
        res.render('index', {
            req: req,
            user: req.isAuthenticated() ? req.user : null,
            bot: client,
            db: con,
            Permisisons: Discord.Permisisons,
            callback: settings.config.callback,
        })
    });

    const http = require('http').createServer(app);
    http.listen(settings.config.port, () => {
        console.log(`[*]`.bold.green + ` Website listening on the port ${settings.config.port}.`.bold.white);
    })
}