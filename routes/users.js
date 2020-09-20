const router = require('express').Router();
let User = require('../models/user.model');
const jwt = require('jsonwebtoken'); //설치해야겠지 // 만약 mongoDB를 사용한다면
const passport = require('passport');

require('dotenv').config()

router.get('/protect', passport.authenticate("jwt", { session: false }), function (req, res) { 
    res.status(200).json({ success: true, msg: 'you are authorized!' })
    
});

router.route('/').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));        
});

router.route('/:id').get((req, res) => {
    User.findOne({ username: req.params.username})
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error ' + err))
});

router.route('/add').post((req, res) => {
    const username = req.body.username;
    const newUser = new User({username});

    newUser.save()
        .then(() => res.json('User Added'))
        .catch(err => res.status(400).json('Error ' + err))
});





router.post('/login', function(req, res, next) {
    User.findOne({ username: req.body.username })
        .then(user => {
            if(!user) {
                res.status(401).json({ success: false, msg: 'cant find user' });
            }

            const isValid = true;
            if(isValid) {
                const tokenObject = jwt.sign({sub: user.username}, process.env.SECRET_KEY )   // 토큰 발행
                res.status(200).json({ success: true, user: user, token: "Bearer " + tokenObject })
            } else {
                res.status(401).json({ success: false, msg: 'wrong password' })
            }

        })
        .catch((err) => {
            next(err)
        });
    });



// router.route('/:id').get((req, res) => {
//     Exercise.findById(req.params.id)
//         .then(Exercise => res.json(exercise))
//         .catch(err => res.status(400.json('Error' + err)))
// });
module.exports = router;