const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
let User = require('./models/user.model');
require('dotenv').config();
// var passport = require('passport');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY, // 이건 내가 따로 설정해줘야 하는거 env 알지? 아무거나 상관없다
};


const strategy = new JwtStrategy(options, (payload, done) => {      // jwt에서 받은 유저 인포를. 백엔드와 비교하는 내용이다. 만약 일치한다면 okay를 리턴해주는거지
    User.findOne({ username: payload.sub })
        .then(user => {
            if(user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch(err => done(err, null))
});
        
module.exports = (passport) => {   // app.js 에서 온 거다 passport
    passport.use(strategy);  
}
