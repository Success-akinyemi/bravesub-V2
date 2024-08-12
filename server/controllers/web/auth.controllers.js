import Mailgen from "mailgen";
import { registerMail } from "../../middleware/mailer.js";
import TokenModel from "../../model/Token.js";
import UserModel from "../../model/User.js";
import crypto from 'crypto'
import sendEmail from "../../middleware/sendEmail.js";
import { sendWhatsappMsg } from "../../routes/whatsapp/sendWhatsappMsg.js";

const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        name: 'Bravesub',
        link: `${process.env.MAIL_WEBSITE_LINK}`
    }
})

export async function register(req, res) {
    console.log('REGISTRATION BODY>>>',req.body);
    const { email, username, firstName, lastName, password, mobile, ConfirmPassword, referredBy, whatsappNumber } = req.body;


    if (!email || !password || !firstName ||!lastName || !username || !mobile || !ConfirmPassword || !whatsappNumber) {
        return res.status(400).json({ success: false, data: 'Please provide all required fields' });
    }

    if (password.length < 6) {
        return res.status(400).json({ success: false, data: 'Passwords must be at least 6 characters long' });
    }

    if (password !== ConfirmPassword) {
        return res.status(400).json({ success: false, data: 'Passwords do not match' });
    }

    const specialChars = /[!@#$%^&*()_+{}[\]\\|;:'",.<>?]/;
    if (!specialChars.test(password)) {
        return res.status(400).json({ success: false, data: 'Passwords must contain at least one special character' });
    }

    const mobileRegex = /^(090|080|070)\d{8}$/;
    if (!mobileRegex.test(mobile)) {
        return res.status(400).json({ success: false, data: 'Invalid phone number format' });
    }

    if(whatsappNumber){
        const mobileRegex = /^(090|080|070)\d{8}$/;
        if (!mobileRegex.test(whatsappNumber)) {
            return res.status(400).json({ success: false, data: 'Invalid whatsapp number format' });
        }
    }

    try {
        const existingEmail = await UserModel.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ success: false, data: 'Email already exists. Please use another email' });
        }

        const existingPhoneNumber = await UserModel.findOne({ mobile });
        if (existingPhoneNumber) {
            return res.status(400).json({ success: false, data: 'Phone Number already exists. Please use another Phone Number' });
        }

        const existingWhatsappNumber = await UserModel.findOne({ whatsappNumber });
        if (existingWhatsappNumber) {
            return res.status(400).json({ success: false, data: 'Whatsapp Number already exists. Please use another Phone Number' });
        }

        const user = await UserModel.create({ firstName, lastName, username, email, password, mobile, createdSource: 'web', whatsappNumber });
        console.log('USER CREATED');

        const referralLink = `${process.env.CLIENT_URL}/register?ref=${user._id}`;
        user.referralLink = referralLink;
        await user.save();

        if (referredBy) {
            if (!referrer.referrals.includes(user._id)) {
                const referrer = await UserModel.findById(referredBy);
                if (referrer) {
                    referrer.referrals.push(user._id);
                    await referrer.save();
                    user.referredBy = referrer._id;
                    await user.save();
                } else {
                    console.log('REFERRER NOT FOUND');
                }
            }
        }

        const token = await new TokenModel({
            userId: user._id,
            token: crypto.randomBytes(32).toString('hex')
        }).save();

        const verifyUrl = `${process.env.MAIL_WEBSITE_LINK}/${user._id}/verify/${token.token}`;
        if(whatsappNumber){
            const message = `Welcome ${user.username} to brave-sub your one stop data, airtime, cable TV, electric bills plug. '\n' Please click on this link ${verifyUrl} to verify your account. '\n' Link is valid for one(1) hour`
            try {
                await sendWhatsappMsg({phoneNumber: whatsappNumber, message, useAI: true})
            } catch (error) {
                console.log('Failed to send WhatsApp message:', error);
            }
                
        }

        try {
            await registerMail({
                username: `${user.firstName} ${user.lastName}`,
                userEmail: user.email,
                subject: 'SIGNUP SUCCESSFUL',
                intro: 'PLEASE VERIFY EMAIL',
                instructions: 'You Have Successfully Signed Up, Please Click on the Button Below to verify your Email Address. Note Email is Valid for One (1) Hour.',
                outro: `
                If you cannot click the reset button, copy and paste the url here in your browser ${verifyUrl}
                  \n  
                If you did not Sign Up, please ignore this email and report.
                `,
                verifyUrl: verifyUrl,
                text: 'Verify Email',
            });

            return res.status(200).json({ success: true, data: `Verification Email Sent to ${email} ${whatsappNumber ? `and to ${whatsappNumber} on whatsapp` : ''}` });
        } catch (error) {
            console.log('ERROR SENDING VERIFY EMAIL', error);
            return res.status(500).json({ success: false, data: 'Email could not be sent' });
        }
    } catch (error) {
        console.log('ERROR REGISTERING USER', error);
        res.status(500).json({ success: false, data: 'Unable to create account' });
    }
}

export async function verifyNewUser(req, res, next){
    const { id } = req.params
    const { token } = req.params
    console.log('PARAMS ID', id)
    console.log('TOKEN', token)
    try {
        const user = await UserModel.findById({ _id: id})
        console.log('ID', user._id)
        if(!user){
            return res.status(400).json({ success: false, data: 'Invalid Link'})
        }

        const token = await TokenModel.findOne({
            userId: user._id,
            token: req.params.token
        })

        if(!token){
            return res.status(400).json({ success: false, data: 'Invalid Link'})
        }

        //await UserModel.updateOne({ _id: user._id, verified: true})
        user.verified = true;
        await user.save()
        const number = user.whatsappNumber
        console.log('NUMBBBER', number)
        await TokenModel.deleteOne({ _id: token._id })

        if (number) {
            console.log('NUMBBBER222', number);
            const message = `Congratulations ${user.username}, your account has been verified. You can now buy data, airtime, cable TV subscriptions, and pay electric bills from your WhatsApp by just chatting with me, BraveLite.`;
            
            try {
                await sendWhatsappMsg({ phoneNumber: number, message, useAI: true });
            } catch (error) {
                console.log('Failed to send WhatsApp message:', error);
            }
        }
        sendToken(user, 200, res)


    } catch (error) {
        console.log('COULD NOT VERIFY USER', error)
        res.status(500).json({ success: false, data: 'Unable to Verify User Account' })        
    }
}

export async function login(req, res){
    const { emailOrMobile, password } = req.body;
    console.log(emailOrMobile, password)

    if(!emailOrMobile || !password){
        return res.status(401).json({ success: false, data: 'Please provide an email and password'})
    }

    try {
        const isEmail = emailOrMobile.includes('@');

        let user;

        if(isEmail){
            user = await UserModel.findOne({ email: emailOrMobile }).select('+password')
        } else {
            user = await UserModel.findOne({ mobile: emailOrMobile }).select('+password')
        }

        console.log('USER NUMBER', user)
        
        if(!user){
            return res.status(401).json({ success: false, data: 'Invalid User'})
        }

        const isMatch = await user.matchPasswords(password);

        if(!isMatch){
            return res.status(401).json({ success: false, data: 'Invalid Password'})
        }

        if(!user.verified){
            console.log('working')
            let token = await TokenModel.findOne({ userId: user._id})
            if(!token){
                const token = await new TokenModel({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString('hex')
                }).save()
        
                const verifyUrl = `${process.env.MAIL_WEBSITE_LINK}/${user._id}/verify/${token.token}`
        
                try {
                    // send mail
                    const emailContent = {
                        body: {
                            intro: 'PLEASE VERIFY EMAIL',
                            action: {
                                instructions: `Your Bravesub Account is not yet valid, Please Click on the Button Below to verify your Email Address. Note Email is Valid for One (1) Hour.`,
                                button: {
                                    color: '#33b5e5',
                                    text: 'Verify Your Email',
                                    link: verifyUrl
                                },
                            },
                            outro: `
                                If you cannot click the reset button, copy and paste the url here in your browser ${verifyUrl}
        
                                If you did not SignUp to Bravesub, please ignore this email and report.
                            `
                        },
                    };
        
                    const emailTemplate = mailGenerator.generate(emailContent)
                    const emailText = mailGenerator.generatePlaintext(emailContent)
                    
                    await sendEmail({
                        to: user.email,
                        subject: 'Verify Your Email',
                        text: emailTemplate
                    })

                    const number = user.whatsappNumber
                    if(number){
                        const message = `Hi ${user.username}, '\n' Please click on this link ${verifyUrl} to verify your account. '\n' Link is valid for one(1) hour`
                        try {
                            await sendWhatsappMsg({phoneNumber: number, message, useAI: true})
                        } catch (error) {
                            console.log('Failed to send WhatsApp message:', error);
                        }
                            
                    }
        
                    return res.status(200).json({success: true, isVerified: false , data: `Verification Email Sent. Check your email address and verify your account`})
                } catch (error) {
                    console.log('ERROR SENDING VERIFY EMAIL', error)
                    return res.status(500).json({ success: false, data: 'Email could not be sent'})
                }
            } else{
                return res.status(200).json({ success: false, isVerified: false, data: 'Account Not Verified. An Email Has been sent to You Please Verify Account'})
            }
        }


        //sendToken(user, 200, res)
        const token = user.getSignedToken();
        const expiryDate = new Date(Date.now() + 10 * 60 * 60 * 1000)
        const { resetPasswordToken, resetPasswordExpire, password: hashedPassword, ...userData } = user._doc
        //res.status(200).json({ success: true, token: token, isVerified: true, data: {success: true, data: userData }})
        res.cookie('bravesubtoken', token, { httpOnly: true, expires: expiryDate, sameSite: 'None', secure: true } ).status(200).json({ success: true, token: token, isVerified: true, data: {success: true, data: userData }})
    } catch (error) {
        console.log('ERROR LOGGING USER', error)
        res.status(500).json({ success: false, data: error.message})
    }
}

export async function forgotPassword (req, res, next){
    const { email } = req.body

    if(!email){
        return res.status(404).json({ success: false, data: 'Provide your registered email address'})
    }

    try {
        const user = await UserModel.findOne({ email });

        if(!user){
            return res.status(404).json({ success: false, data: 'Email Does Not Exist'})
        }

        const resetToken = user.getResetPasswordToken()

        await user.save()
        const number = user.whatsappNumber
        const resetUrl = `${process.env.MAIL_WEBSITE_LINK}/reset-password/${resetToken}`

        if(number){
            const message =  `Your password reset link is: '\n' ${resetUrl} '\n' this link is valid for Ten(10) minutes.`
            try {
                await sendWhatsappMsg({phoneNumber: number, message, useAI: true})
            } catch (error) {
                console.log('Failed to send WhatsApp message:', error);
            }
        }
        try {
            // send mail
            const emailContent = {
                body: {
                    intro: 'You have Requested a password reset.',
                    action: {
                        instructions: 'Please click the following button to reset your password. Link Expires in 10 mintues',
                        button: {
                            color: '#33b5e5',
                            text: 'Reset Your Password',
                            link: resetUrl
                        },
                    },
                    outro: `
                        If you cannot click the reset button, copy and paste the url here in your browser ${resetUrl}

                        If you did not request this reset, please ignore this email.
                    `
                },
            };

            const emailTemplate = mailGenerator.generate(emailContent)
            const emailText = mailGenerator.generatePlaintext(emailContent)
            
            await sendEmail({
                to: user.email,
                subject: 'Password Reset Request',
                text: emailTemplate
            })
            res.status(200).json({success: true, msg: 'Email sent', data: email })
        } catch (error) {
            user.resetPasswordToken = undefined
            user.resetPasswordExpire = undefined

            await user.save()
            return res.status(500).json({ success: false, data: 'Email could not be sent' })
        }
    } catch (error) {
        console.log('ERROR GENERATING RESET LINK', error)
        res.status(500).json({ success: false, data: error.message})
    }
}

export async function resetPassword (req, res, next){
    const { password, confirmPassword } = req.body
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex')

    try {
        if (password.length < 6) {
            return res.status(400).json({ success: false, data: 'Passwords must be at least 6 characters long' });
        }
    
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, data: 'Passwords do not match' });
        }
    
        const specialChars = /[!@#$%^&*()_+{}[\]\\|;:'",.<>?]/;
        if (!specialChars.test(password)) {
            return res.status(400).json({ success: false, data: 'Passwords must contain at least one special character' });
        }

        const user = await UserModel.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now()}
        })

        if(!user){
            return  res.status(400).json({ success: false, data: 'Invalid Reset Token'})
        }

        user.password = password
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined

        await user.save();

        res.status(201).json({
            success: true,
            data: 'Password Reset success'
        })
    } catch (error) {
        console.log('ERROR RESETING USER PASSWORD', error)
        res.status(500).json({ success: false, data: error.message})
    }
}

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({success: true, token, isVerified: true})
}

export async function signout(req, res){
    res.clearCookie('bravesubtoken').status(200).json({success: true, data: 'Signout success'})
}