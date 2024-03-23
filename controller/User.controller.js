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

// //Authenticate admin and get token
// const login = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         //See if user Exist
//         let user = await Admin.findOne({ email: email });
//         console.log(user);
//         if (!user) {
//             return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
//         }

//         //match the user email and password

//         const isMatch = await bcrypt.compare(password, user.password);

//         if (!isMatch) {
//             return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
//         }

//         //Return jsonwebtoken

//         const token = await user.generateAuthToken();
//         return res.status(200).json({ tokenId: token });
//     } catch (err) {
//         //Something wrong with the server
//         console.error(err.message);
//         return res.status(500).send('Server Error');
//     }
// };

// const getUserByName = async (req, res) => {
//     const { email } = req.body;

//     try {
//         // See if user exists
//         let user = await Admin.findOne({ email: email });

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         // Return the user's name
//         return res.status(200).json({ MongoId: user._id });
//     } catch (err) {
//         // Log the error for debugging purposes
//         console.error('Error retrieving user:', err);

//         // Return a more detailed error message
//         return res.status(500).json({ error: 'Server Error', message: err.message });
//     }
// };

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Authenticate admin
        let user = await Admin.findOne({ email: email });

        // Check if user exists
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        // Match the user email and password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        // Generate jsonwebtoken
        const token = await user.generateAuthToken();

        // Return user's ID, first name, and token
        return res.status(200).json({
            tokenId: token,
            userId: user._id,
        });
    } catch (err) {
        // Log the error for debugging purposes
        console.error('Error during login:', err);

        // Return a more detailed error message
        return res.status(500).json({ error: 'Server Error', message: err.message });
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
        .catch((error) => res.status(400).json("Error: " + error));
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
const getUserById = async (req, res) => {
    try {
        const user = await Admin.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching Iser by ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};



module.exports = { getAdmin, login, register, updateUser, getUsers, getUserById };
