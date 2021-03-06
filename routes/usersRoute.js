const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const config = require('../config');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const User = require('../models/usersModel.js');


// Check if E-mail is Valid or not
const validateEmail = (email) => {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

const checkUserUniqueness = (field, value) => {
  return { error, isUnique } = User.findOne({[field]: value}).exec()
    .then(user => {
      let res = {};
      if (Boolean(user)) {
        return res = { error: { [field]: "This " + field + " is not available" }, isUnique: false, udata: user };
      } else {
        return res = { error: { [field]: "" }, isUnique: true, udata: user };
      }
    })
    .catch(err => {
      console.log('catch bolck----', err);
      throw err;
    })
}

const sendEmail = (useremail, userid) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'dgtlz.finance@gmail.com',
      pass: 'adkztkP!22'
    },
  });
  
  const mailOptions = {
    from: 'dgtlz.finance@gmail.com',
    to: useremail,
    subject: 'Welcome to DGTLZ Finance',
    html: `<h2 style="color: #5e9ca0;">Welcome to DGTLZ Finance</h2>
            <p>Greeting of the Day!</p>
            <p>Verify your email address by clicking on the below link:</p>
            <p>Click&nbsp; <a href="https://dgtlz.finance/verify?post=${userid}"> 
            <span style="background-color: #666699; color: #fff; display: inline-block; padding: 3px 10px; font-weight: bold; border-radius: 5px;">
              Verify Email</span> </a> to verify.
            </p><p>&nbsp;</p>
            <p>Thanks and Regards,<br />DGTLZ Finance Team</p>`
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}


const sendKycEmail = (userdata) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'dgtlz.finance@gmail.com',
      pass: 'adkztkP!22'
    },
  });
  
  const mailOptions = {
    from: 'dgtlz.finance@gmail.com',
    to: `${userdata.useremail}, 'webdev@dgtlz.finance'`,
    subject: 'Kyc Detials from DGTLZ Finance',
    html: `<h2 style="color: #5e9ca0;">Welcome to DGTLZ Finance</h2>
            <p>Greeting of the Day!</p>
            <p>Below is the Kyc Details provide by you (${userdata.useremail}):</p>
            <p>
            <button className="btn btn-success btn-round py-3 col-md-8">
              <table>
                <tr><td> Customer Id:</td> <td> ${userdata.customerid}</td></tr>
                <tr><td> Document Type:</td> <td> ${userdata.docType}</td></tr>
                <tr><td> Document Name:</td> <td> ${userdata.docName}</td></tr>
              </table>
            </button>
            </p>
            </p><p>&nbsp;</p>
            <p>Thanks and Regards,<br />DGTLZ Finance Team</p>`
  };

  sendKycEmailTOAdmin(userdata);
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

const sendKycEmailTOAdmin = (userdata) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'dgtlz.finance@gmail.com',
      pass: 'adkztkP!22'
    },
  });
  
  const mailOptions = {
    from: 'dgtlz.finance@gmail.com',
    to: 'webdev@dgtlz.finance',
    subject: 'New Kyc Request',
    html: `<h2 style="color: #5e9ca0;">New Kyc Request</h2>
            <p>Greeting of the Day!</p>
            <p>Below is the Kyc Details provide by (${userdata.useremail}):</p>
            <p>
            <button className="btn btn-success btn-round py-3 col-md-8">
              <table>
                <tr><td> Customer Id:</td> <td> ${userdata.customerid}</td></tr>
                <tr><td> Document Type:</td> <td> ${userdata.docType}</td></tr>
                <tr><td> Document Name:</td> <td> ${userdata.docName}</td></tr>
              </table>
            </button>
            </p>
            <p> Please check the details and do the needfull</p>
            <p> For any further details required to approve the KYC please contact to the Kyc Provider</p>
            </p><p>&nbsp;</p>
            <p>Thanks and Regards,<br />DGTLZ Finance Team</p>`
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}



const KycApproveEmail = (userdata) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'dgtlz.finance@gmail.com',
      pass: 'adkztkP!22'
    },
  });
  
  const mailOptions = {
    from: 'dgtlz.finance@gmail.com',
    to: userdata.useremail,
    subject: 'Kyc Detials Approved by DGTLZ Finance',
    html: `<h2 style="color: #5e9ca0;">Welcome to DGTLZ Finance</h2>
            <p>Greeting of the Day!</p>
            <p>Congratulation! your Kyc Details has been approved by DGTLZ Finance Team</p>
            <p>You can continue your joureny by selecting appropriate plans</p>
            </p><p>&nbsp;</p>
            <p>Thanks and Regards,<br />DGTLZ Finance Team</p>`
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}




router.post('/validate', async (req, res) => {
    const { field, value } = req.body;
    const { error, isUnique } = await checkUserUniqueness(field, value);

    if (isUnique) {
        res.json({ success: 'success' });
    } else {
        res.json({ error });
    }
});

router.post('/signup', (req, res) => {
    const name = req.body.name || '';
    const lastname = req.body.lastname || '';
    const email = req.body.email || '';
    const password = req.body.password || '';
    const confirmPassword = req.body.confirmPassword || '';
    const logintype = req.body.logintype || '';

    const reqBody = { name, lastname, email, password, confirmPassword, logintype };

    let errors = {};
    Object.keys(reqBody).forEach(async field => {
        if (reqBody[field] === '') {
            errors = {...errors, [field]: 'This field is required'}
        }

        if ((logintype != 'Gmail' && logintype != 'Facebook')) {
        
          if (field === 'username' || field === 'email') {
              const value = reqBody[field];
              const { error, isUnique, udata } = await checkUserUniqueness(field, value);
              if (!isUnique) {
                  errors = {...errors, ...error};
                  res.json({ errors: { invalidCredentials: 'Email is already exist.' }, da: udata });
                  return;
              }
          }
        }

        if (field === 'email' && !validateEmail(reqBody[field])) {
            errors = {...errors, [field]: 'Not a valid Email'}
        }
        if (field === 'password' && password !== '' && password < 4) {
            errors = {...errors, [field]: 'Password too short'}
        }
        if (field === 'confirmPassword' && confirmPassword !== password) {
            errors = {...errors, [field]: 'Passwords do not match'}
        }
    });

    if (Object.keys(errors).length > 0) {
        res.json({ errors });
    } else {
      const newUser = new User({
        name: name,
        lastname: lastname,
        username: `${name.charAt(0).toLowerCase()}.${lastname.toLowerCase()}@${new Date()}`,
        email: email,
        password: password,
        verified: false,
        iskyc: false,
        logintype: logintype,
        mobile: '',
        location: '',
        customerid:  uuidv4(),
      });

      // Generate the Salt
      bcrypt.genSalt(10, (err, salt) => {
        if(err) return err;
        // Create the hashed password
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if(err) {
            res.json({ error: err});
            return;
          }
          newUser.password = hash;
          // Promise
          // newUser.save().then((user) => {
          //   sendEmail(email, user._id)
          //   res.json({ success: 'success', details: user._id });
          // }).catch((error) => {
          //   res.json({ error: 'User present'});
          //     return;
          // });


          // Save the User
          newUser.save(function(err, value){
            if(err) {
              res.json({ error: 'User present'});
              return;
            }
            sendEmail(email, value._id)
            res.json({ success: 'success', details: value._id });
          });


        });
      });
    }
});

router.post('/login', (req, res) => {
    const username = req.body.username || '';
    const password = req.body.password || '';
    let errors = {};

    if (username === '') {
        errors = {...errors, username: 'This field is required' };
    }
    if (password === '') {
        errors = {...errors, password: 'This field is required' };
    }

    if (Object.keys(errors).length > 0) {
        res.json({ errors });
    } else {
        User.findOne({email: username}, (err, user) => {
            if (err) throw err;
            if (Boolean(user)) {
                // Match Password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) return err;
                    if (isMatch) {
                        const token = jwt.sign({
                                id: user._id,
                                username: user.username
                            }, config.jwtSecret);
                        res.json({ token, success: 'success', details: user })
                    } else {
                       res.json({ errors: { invalidCredentials: 'Invalid Username or Password' } });
                    }
                });
            } else {
                res.json({ errors: { invalidCredentials: 'Invalid Username or Password else 1' }, d: user });
            }
        });
    }
});

router.get('/list', (req, res) => {
    return User.find((err, user) => {
        if (err) return res.json(err);
        res.json({ details: user, success: 'success' })
    })
});

router.get('/kyclist', (req, res) => {
    return User.find({ iskyc: false}, (err, user) => {
        if (err) throw err;
        res.json({ details: user, success: 'success' })
    })
});

router.post('/approveKyc', (req, res) => {
  console.log('Approve KYC DETAILS', req.body);
  const filter = { _id: req.body.userid };
  const update = {
    iskyc: true
  };
  return User.findOneAndUpdate(filter, update, {new: true, useFindAndModify: false},
    function(err, result) {
      if(err) {
        return res.json({ error: 'Fail to upload image'});
      }
      KycApproveEmail(req.body);
      return res.json({ success: 'success' });
    });
});

router.post('/verifyEmail', (req, res) => {
  const filter = { _id: req.body.id };
  const update = {
    emailVerified: true
  };
  return User.findOneAndUpdate(filter, update, {new: true, useFindAndModify: false},
    function(err, result) {
      if(err) {
        return res.json({ error: 'Fail to Verify'});
      }
      return res.json({ success: 'success' });
    });
});

router.post('/userdetails', async (req, res) => {
  let userid = req.body.id;

  return User.findOne({ _id: userid}, function(err, result) {
    if (err) {
      return err;
    }
    if (result) {
      res.json({details: result, success: 'success'});
    } else {
      res.json({success: 'Fail-no data found'});
    } 
  })
  .catch(err => console.log(err))
});


router.post('/imageUpload', async (req, res) => {
  console.log('LYC DETAILS', req.body);
  let userid = req.body.id;
  let image = req.body.image;
  let docType = req.body.docType;
  let docName = req.body.docName;

  const filter = { _id: userid };
  const update = { 
    image: image,
    docType: docType,
    docName: docName,
    iskyc: false
  };
  
  return User.findOneAndUpdate(filter, update, {new: true, useFindAndModify: false},
    function(err, result) {
      if(err) {
        return res.json({ error: 'Fail to upload image'});
      }
      sendKycEmail(req.body);
      return res.json({ success: 'success' });
    });
});

router.post('/userProfileUpdate', async (req, res) => {
  console.log('update pro --', req.body);
  let userid = req.body._id;
  let location = req.body.location;
  let mobile = req.body.mobile;

  const filter = { _id: userid };
  const update = { 
    location: location,
    mobile: mobile,
  };
  
  return User.findOneAndUpdate(filter, update, {new: true, useFindAndModify: false},
    function(err, result) {
      if(err) {
        return res.json({ error: 'Fail to upload image'});
      }
      return res.json({ success: 'success' });
    });
});

router.post('/updateAdminProfile', async (req, res) => {
  console.log('req', req);
  let userid = req.body._id;
  let psw = req.body.password;
  let name = req.body.name;

  const filter = { _id: userid };
  const update = { 
    name: name,
    password: psw,
  };
  
  return User.findOneAndUpdate(filter, update, {new: true, useFindAndModify: false},
    function(err, result) {
      if(err) {
        return res.json({ error: 'Fail to upload profile'});
      }
      return res.json({ success: 'success' });
    });
});


router.post('/socialogin', async (req, res) => {
  // let useremail = req.body.email;

  const name = req.body.name || '';
  const lastname = req.body.lastname || '';
  const useremail = req.body.email || '';
  const password = req.body.password || '';
  const logintype = req.body.logintype || '';

  return User.find({ email: useremail, logintype: logintype}, async function(err, result) {
    if(err) {
      res.json({ error: err});
      return;
    }
    if (result != '') {
      console.log('result!!!!!!!!!!!!!', result);
      // let responseResult = {};
      // responseResult = { success: 'success', details: result[0]._id }
      // res.json(responseResult);
      res.json({details: result[0]._id, success: 'success'});
    } else {
      // res.json({success: 'notfound'});
      // res.end();
      const newUser = new User({
        name: name,
        lastname: lastname,
        email: useremail,
        password: password,
        verified: false,
        iskyc: false,
        logintype: logintype,
        username: `${name.charAt(0).toLowerCase()}.${lastname.toLowerCase()}@${new Date()}`,
        mobile: '',
        location: '',
        customerid:  uuidv4(),
      });

      // Generate the Salt
      bcrypt.genSalt(10, (err, salt) => {
        if(err) return err;
        // Create the hashed password
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if(err) {
            res.json({ error: err});
            return;
          }
          newUser.password = hash;
          // Save the User
          newUser.save(function(err, value){
            let responseResult = '';
            console.log("Erro",err)
            if(err) {
              res.json({ error: `User already exit with ${logintype == 'Gmail' ? 'Facebook' : 'Gmail'} Account`});
              return;
            }
            sendEmail(useremail)
            responseResult = { success: 'success', details: value._id }
            res.json(responseResult);
          });
        });
      });

    }
  })
});

module.exports = router;
