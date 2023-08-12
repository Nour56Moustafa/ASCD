const {StatusCodes} = require('http-status-codes')
const Company = require('../models/company')
const { ObjectId } = require('mongoose').Types;
const cookie = require('cookie');
const fs = require('fs')
const path = require('path');

const createCompany = async (req, res) => {
    try {
        const { email, password, name, origin, branches, accounts, desc } = req.body;

        // Process uploaded images using Multer
        const profileImg = req.files[0];
        const companyImg = req.files[1];

        //Check if the email is already registered
        const existingCompany = await Company.findOne({ email });
        if (existingCompany) {
            return res.status(StatusCodes.CONFLICT).json({ error: 'Email already exists' });
        }

        // limit the image size up to 5 MB
        if(profileImg.size > 5242880 || companyImg.size > 5242880){
            res.status(StatusCodes.BAD_REQUEST).json({ error: 'Both files are/one file is too large to be uploaded, choose another file and try again' });
        }

        // Process and save the image to the local storage
        const imageFolder = path.join(__dirname, '../public/images');
        fs.mkdir(imageFolder, { recursive: true }, cb => {}); // Create the 'images' folder if it doesn't exist
        
        // Process and save the images to the local storage
        const uniqueProfileImgName = Date.now() + '-' + profileImg.originalname;
        const uniqueCompanyImgName = Date.now() + '-' + companyImg.originalname;
        const profileImgPath = path.join(imageFolder, uniqueProfileImgName);
        const companyImgPath = path.join(imageFolder, uniqueCompanyImgName);

        fs.rename(profileImg.path, profileImgPath, (err) => {
            if(err){
                throw err
            }
        }); // Move the uploaded file to the 'images' folder with the unique filename

        fs.rename(companyImg.path, companyImgPath, (err) => {
            if(err){
                throw err
            }
        }); // Move the uploaded file to the 'images' folder with the unique filename

        const newCompany = await Company.create({
            email,
            password,
            name,
            origin,
            branches: branches.split(',').map(branch => branch.trim()), // Convert comma-separated string to an array
            accounts: accounts.split(',').map(account => account.trim()), // Convert comma-separated string to an array
            desc,
            profileImgUrl: profileImgPath,
            companyImgUrl: companyImgPath,
        });

        // Generate a JWT token for the user
        const token = newCompany.createJWT();
        
        res
            .status(StatusCodes.CREATED)
            .cookie('token', token, {
                secure: true,
                httpOnly: true,
                maxAge: 8640000,
                domain: `localhost`,
                sameSite: 'lax',
            })
            .json({ message: 'Company created successfully', company: newCompany, token });
    } catch (error) {
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
};

const getAllCompanies = async (req, res) => {
    try {
        // Get approved companies
        const approvedCompanies = await Company.find({ approved: true });

        res.status(StatusCodes.OK).json({ companies: approvedCompanies });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const getUnapprovedCompanies = async (req, res) => {
    try {
        // Get unapproved companies
        const unapprovedCompanies = await Company.find({ approved: false });

        res.status(StatusCodes.OK).json({ companies: unapprovedCompanies });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const getCompany = async (req, res) => {
    try {
        const { companyID } = req.params;

        // Check if the provided ID is a valid ObjectId
        if (!ObjectId.isValid(companyID)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid company ID' });
        }

        // Fetch the company by ID
        const company = await Company.findById(companyID);

        if (!company) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Company not found' });
        }

        res.status(StatusCodes.OK).json({ company });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const updateCompany = async (req, res) => {
    try {
        // Access the company's ID from the authentication token (it is set in the req.company field by the authenticateUser middleware)
        const id = req.company.id;

        const { name, origin, branches, accounts, desc } = req.body;
        
        // Process uploaded images using Multer
        const profileImg = req.files[0];
        const companyImg = req.files[1];
    
        // Check if the provided ID is a valid ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid company ID' });
        }

        // Find the company in the database by its ID
        const company = await Company.findById(id);
  
        if (!company) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Company not found' });
        }

        // limit the image size up to 5 MB
        if(profileImg.size > 5242880 || companyImg.size > 5242880){
            res.status(StatusCodes.BAD_REQUEST).json({ error: 'Both files are/one file is too large to be uploaded, choose another file and try again' });
        }
    
        // Update the company fields
        company.name = name || company.name;
        company.origin = origin || company.origin;
        company.desc = desc || company.desc;
        company.branches = branches.split(',').map(branch => branch.trim()) || company.branches;
        company.accounts = accounts.split(',').map(account => account.trim()) || company.accounts;
    
        // Update the profile image if provided
        if (profileImg) {
            // delete old company images for memory saving
            fs.unlinkSync(company.profileImgUrl); // Delete the image file synchronously

            // Process and save the image to the local storage
            const imageFolder = path.join(__dirname, '../public/images');
            await fs.mkdir(imageFolder, { recursive: true }, cb => {}); // Create the 'images' folder if it doesn't exist

            const uniqueFilename = Date.now() + '-' + profileImg.originalname;
            const imagePath = path.join(imageFolder, uniqueFilename);

            await fs.rename(profileImg.path, imagePath, (err) => {
                if(err){
                    throw err
                }
            }); // Move the uploaded file to the 'images' folder with the unique filename
            profileImg.path = imagePath

            company.profileImgUrl = profileImg.path;
        }
    
        // Update the company image if provided
        if (companyImg) {
            // delete old company images for memory saving
            fs.unlinkSync(company.companyImgUrl); // Delete the image file synchronously

            // Process and save the image to the local storage
            const imageFolder = path.join(__dirname, '../public/images');
            await fs.mkdir(imageFolder, { recursive: true }, cb => {}); // Create the 'images' folder if it doesn't exist

            const uniqueFilename = Date.now() + '-' + companyImg.originalname;
            const imagePath = path.join(imageFolder, uniqueFilename);

            await fs.rename(companyImg.path, imagePath, (err) => {
                if(err){
                    throw err
                }
            }); // Move the uploaded file to the 'images' folder with the unique filename
            companyImg.path = imagePath

            company.companyImgUrl = companyImg.path;
        }

        // Save the updated blog to the database
        await company.save();
    
        res.status(StatusCodes.OK).json({ company });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong.' });
    }
}

const deleteCompany = async (req, res) => {
    try {
        // Access the company's ID from the authentication token (it is set in the req.company field by the authenticateUser middleware)
        const id = req.company.id;
        
        // Check if the provided ID is a valid ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid company ID' });
        }
        
        // Find company in the database
        const company = await Company.findById(id)

        // If the company is not found, return a 404 not found error
        if (!company) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Company not found' });
        }

        // Delete the company images from local storage if it exists
        if (company.profileImgUrl) {
            const imagePath = company.profileImgUrl
            fs.unlinkSync(imagePath); // Delete the image file synchronously
        }
        if (company.companyImgUrl) {
            const imagePath = company.companyImgUrl
            fs.unlinkSync(imagePath); // Delete the image file synchronously
        }
        // Delete the company from the database
        await company.remove();
        res.status(StatusCodes.OK).json({ message: 'Company deleted successfully' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const approveCompany = async (req, res) => {
    try {
        const { companyID } = req.params;
        
        // Check if the provided ID is a valid ObjectId
        if (!ObjectId.isValid(companyID)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid company ID' });
        }
        
        // Find company in the database
        const company = await Company.findById(companyID)

        // If the company is not found, return a 404 not found error
        if (!company) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Company not found' });
        }

        company.approved = true;

        // Save the updated blog to the database
        await company.save();

        res.status(StatusCodes.OK).json({ message: 'Company approved successfully' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}


module.exports = {
    createCompany,
    getAllCompanies,
    getCompany,
    updateCompany,
    deleteCompany,
    approveCompany,
    getUnapprovedCompanies
}