const Pool = require('./../../connection');
const bcrypt = require('bcryptjs');

exports.singup = async (req, res, next) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.pass, 10);

        const [result] = await Pool.query(`
        INSERT INTO users (username,email,pass)
        VALUES (?,?,?)
        `,[req.body.username, req.body.email, hashedPassword])

        const userid = result.insertId

        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            userID: userid
        });
    }
    catch(err){
        console.error('Error signing up user: ', err);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while signing up user'
        });
    }
};

exports.login = async (req, res, next) => {
    try{
        const { email, pass } = req.body

        if(!email || !pass){
            return res.status(400).json({ status: 'error', message: 'Please provide complete credentials' });
        }
        
        const [ result ] = await Pool.query(`
        SELECT * FROM users
        WHERE email = ?
        `,[email])
        const user = result[ 0 ];
        
        if (!user){
            res.status(401).json({ status: 'error', message: 'Incorrect email or password' });
        }
        
        const passwordMatch = await bcrypt.compare(pass, user.pass);

        if (passwordMatch) {
            const LoggedInUser = { ...user };
            delete LoggedInUser.pass;
            delete LoggedInUser.created;

            return res.status(200).json({
                status: 'success',
                data: {
                    LoggedInUser
                }
            });
        }
    }
    catch(err){
        console.error('Error logging in user:', err);
        return res.status(500).json({ status: 'error', message: 'An error occurred while logging in user' });
    }
};
