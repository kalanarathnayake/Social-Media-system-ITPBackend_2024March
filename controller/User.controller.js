const bcrypt = require('bcryptjs'); //hash feature
const Admin = require('../model/User.model');

//get Admin details
const getAdmin = async (req, res) => {
    try {
        //get user details
        //-password : dont return the pasword
        console.log(req.user);
        const user = await Admin.findById(req.user._id).select('-password');
        res.status(200).json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
};

//Authenticate admin and get token
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        //See if user Exist
        let user = await Admin.findOne({ email: email });
        console.log(user);
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        //match the user email and password

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        //Return jsonwebtoken

        const token = await user.generateAuthToken();
        return res.status(200).json({ tokenId: token });
    } catch (err) {
        //Something wrong with the server
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
};

// firstName
// lastName
// email
// password
// phoneNumber
// location
// jobTitle
// role
// imgURL


//Register admin
const register = async (req, res) => {
    console.log('here');
    //destructure
    const { firstName, lastName, email, password, phoneNumber, location, jobTitle, role, imgURL } = req.body;

    try {
        //See if user Exist
        let user = await Admin.findOne({ email });
        console.log(req.body, user);
        if (user) {
            return res.status(400).json({ errors: [{ msg: 'Admin already exist' }] });
        } else {
            const newUser = new Admin({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                location: location,
                phoneNumber: phoneNumber,
                jobTitle: jobTitle,
                imgURL: imgURL,
                role: role,
            });

            const registerdUser = await newUser.save();
            // await newUser.generateAuthToken();
            return res.status(201).json(registerdUser);
        }
    } catch (err) {
        //Something wrong with the server
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
};

//Update Exsisting User
const updateUser = async (req, res) => {
    Admin.findByIdAndUpdate(req.params.id).
        then((exsistingUser) => {
            exsistingUser.firstName = req.body.firstName;
            exsistingUser.lastName = req.body.lastName;
            exsistingUser.email = req.body.email;
            exsistingUser.password = req.body.password;
            exsistingUser.location = req.body.location;
            exsistingUser.phoneNumber = req.body.phoneNumber;
            exsistingUser.jobTitle = req.body.jobTitle;
            exsistingUser.imgURL = req.body.imgURL;
            exsistingUser.role = req.body.role;
            exsistingUser.save()
                .then((updatedUser) => res.json(updatedUser))
                .catch((error) => res.status(400).json("Error: " + error));
        })
        .catch((error) => res.status(400).json("Error: 1" + error));
};


//get all ticket records
const getUsers = async (req, res) => {
    try {
        const user = await Admin.find();
        res.json(user)
    } catch (error) {
        res.status(500).send("Server Error : " + error);
    }
}



module.exports = { getAdmin, login, register, updateUser, getUsers };
