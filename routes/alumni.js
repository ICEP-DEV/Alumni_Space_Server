const express = require('express');
const router = express.Router();
const connection = require('./../database/database')
const multer = require('multer');
var nodemailer = require('nodemailer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = 'uploads/';
        const fileType = req.body.fileType;
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });


router.post("/register", (req, res) => {
    // query to check existing email
    const sql_check_email = 'select * from alumni where email =?'

    // query to perform alumni insertion
    const sql_body = [req.body.alumni_name, req.body.alumni_surname, req.body.email, req.body.password, req.body.mobileNo, 'alumni']
    const sql = `insert into alumni(alumni_name, alumni_surname, email, password, mobileNo, role)
                    values(?,?,?,?,?,?)`;

    // Add two hours in for expiring time
    var timeExpire = new Date();
    timeExpire.setHours(timeExpire.getHours() + 2);

    // get six random number as otp
    var random = Math.floor(100000 + Math.random() * 900000);

    connection.query(sql_check_email, req.body.email, (error, rows) => {
        if (error) {
            console.log(error)
            return;
        }
        if (rows.length > 0) {
            res.send({ success: false, message: 'Alumnus already exist' })
        }
        else {
            connection.query(sql, sql_body, (err, result) => {
                if (err) {
                    console.log(err)
                    return;
                }
                if (result.affectedRows != 0) {
                    // get imcrement automation number as id
                    var alumniId = result.insertId

                    // perform otp insertion 
                    const sql_body_otp = [random, timeExpire, false, alumniId]
                    const sql_otp = `insert into otp(otp_number, date_expire, is_expired, alumni_id)
                                    values(?,?,?,?)`;

                    connection.query(sql_otp, sql_body_otp, (error, results) => {
                        if (error) console.log(error)
                        if (results.affectedRows != 0) {
                            sendEmail(req.body.email, random)
                            res.send({alumniId, success: true, message: "successfull added email will be sent with otp to complete the registration" })
                        }
                    })
                }
                else {
                    res.send({ success: false, message: "Unable to alumnus is recorder..." })
                }
            })
        }
    })
})

router.put('/activate_account/:alumni_id', (req, res) => {
    var sql_check_id_otp = `select * from otp where alumni_id =? and otp_number =? `
    connection.query(sql_check_id_otp, [req.params.alumni_id, req.body.otp_number], (error, rows) => {
        if (error) console.log(error)
        if (rows.length > 0) {
            console.log(rows[0].date_expire)
            var date = new Date();
            console.log(date)
            if (!Boolean(rows[0].is_expired || rows[0].date_expire < date)) {
                // force otp to expier
                var sql_otp = `update otp
                                        set is_expired = true
                                        where alumni_id = ${req.params.alumni_id}`;
                connection.query(sql_otp, (err, result) => {
                    if (err) console.log(err)
                })

                // activate the alumni account
                var sql_alumni = `update alumni
                                    set verified = true
                                    where alumni_id = ${req.params.alumni_id}`;
                connection.query(sql_alumni, (err, result) => {
                    if (err) console.log(err)
                })

                res.send({ success: true, message: 'OTP entered is correct' })
            }
            else {
                res.send({ success: false, message: 'OTP entered is expired' })
            }
        }
        else {
            res.send({ success: false, message: 'OTP entered is incorrect' })
        }
    })
    /*
    var sql_body = `update otp
                    set `*/
})

/* authenticade user before  */
function sendEmail(email, otp) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'jntokozo195@gmail.com',
            pass: 'kcdabumoyiwrbpyg'
        }
    });

    var mailOptions = {
        from: 'jntokozo195@gmail.com',
        to: email,
        subject: 'OTP confirmation',
        text: `Your OTP is ${otp}. Use it as alumni verification code.`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

router.get("/test", (req, res) => {
    //var random = Math.floor(100000 + Math.random() * 900000);
    //sendEmail('lebute97@gmail.com', random)
    var timeExpire = new Date();
    timeExpire.setHours(timeExpire.getHours() + 2);

    var random = Math.floor(100000 + Math.random() * 900000);
    const sql_body_otp = [random, timeExpire, false, 2]
    const sql_otp = `insert into otp(otp_number, date_expire, is_expired, alumni_id)
                    values(?,?,?,?)`;

    connection.query(sql_otp, sql_body_otp, (err, result) => {
        if (err) console.log(err)
        if (result.affectedRows != 0) {
            res.send({ result, success: true, message: "successfull added email will be sent with otp to complete the registration" })
        }
    })
})

router.post("/login", (req, res) => {
    const sql = `select *
    from alumni
    where email =?`

    connection.query(sql, req.body.email, (err, result) => {
        if (err) {
            console.log(err)
            return
        }
        if (result.length > 0) {

            if (result[0].password == req.body.password) {
                console.log(result)
                if (Boolean(result[0].verified)) {
                    res.send({ success: true, result })
                }
                else {
                    res.send({ success: false, message: 'The account is not active' })
                }
            }
            else {

                res.send({ success: false, message: 'Wrong username or password' })
            }
        }
        else {
            res.send({ success: false, message: 'Wrong username or password' })
        }
    })
})


router.post("/addAlminiProfile", upload.single('image'), (req, res) => {
    console.log(req.body.interests.split(","))
    var interest_name = req.body.interests.split(",")

    var image_name = "default.png"
    if (req.file != undefined) {
        image_name = req.file.filename
    }

    const sql_profile_body = [req.body.location, req.body.bio, image_name, req.body.alumni_id]
    const sql_profile = `insert into userprofile(location, bio, profile_pic, alumni_id)
                        values(?,?,?,?)`;

    connection.query(sql_profile, sql_profile_body, (error, rows) => {
        if (error) { console.log(error); return }
        if (rows.affectedRows != 0) {
            const profile_id = rows.insertId
            var success = true;
            var message = "Added work experience successfully"
            for (var k = 0; k < interest_name.length; k++) {
                const sql_body_interests = [interest_name[k], profile_id]
                const sql_interests = `insert into interest(interest_name,userprofile_id)
                   values(?,?)`
                connection.query(sql_interests, sql_body_interests, (err, result) => {
                    if (err) { console.log(err); return }
                    if (result.affectedRows == 0) {
                        success = false
                        message = "Unable to update some records, but you can add them later"
                        return;
                    }
                })
            }
            res.send({ success, message })

        }
        else {
            console.log("Unable to add progile")
            res.send({ success: false, message: 'Unable to add progile' })
        }
    })

})

router.get('/getInterests/:userprofile_id', (req, res) => {
    var sql = `select *
                from interest
                where userprofile_id=?`
    connection.query(sql, req.params.userprofile_id, (err, result) => {
        if (err) console.log(err)
        if (result.length > 0) {
            res.send({ success: true, result })
        }
        else {
            res.send({ success: false, message: "No profile found" })
        }
    })
})

// =======================================Employment=======================================================//
router.post('/addWorkExperience', (req, res) => {
    const sql_body_work_experience = [req.body.company_name, req.body.company_role, req.body.start_date, req.body.end_date, req.body.userprofile_id]
    const sql_work_experience = `insert into employment(company_name, company_role,start_date,end_date,userprofile_id)
                                    values(?,?,?,?,?)`


    // update user profile(company, position and employment status)
    var employ_type = req.body.employ_type;
    if (employ_type != "Self Employed") {
        if (req.body.end_date != null) {
            employ_type = "Employed";
        }
        else {
            employ_type = "Unemployed";
        }
    }

    var sql_update_profile_body = [req.body.company_name, req.body.company_role, employ_type, req.body.userprofile_id]
    var sql_update_profile = `update userprofile
                                set company=?,
                                position =?,
                                employ_type=?
                                where userprofile_id=?`;

    connection.query(sql_work_experience, sql_body_work_experience, (err, result) => {
        if (err) { console.log(err); return }
        if (result.affectedRows != 0) {
            connection.query(sql_update_profile, sql_update_profile_body, (error, rows) => {
                if (error) {
                    console.log(error)
                    return;
                }
                if (rows.affectedRows != 0) {
                    res.send({ success: true, message: "Added work experience successfully" })
                }
                else {
                    res.send({ success: false, message: "Unable to comeplete to update some records, but you can add them later" })
                }
            })
        }
        else {
            res.send({ success: false, message: "Unable to add records, but you can add them later" })
        }
    })
})

router.put("/updateWorkExperience/:employment_id", (req, res) => {
    const sql_body = [req.body.company_name, req.body.company_role, req.body.start_date, req.body.end_date, req.params.employment_id]
    const sql = `update employment
                set company_name=?,
                company_role=?,
                start_date=?,
                end_date=?
                where employment_id=?
                `
    connection.query(sql, sql_body, (err, result) => {
        if (err) console.log(err)
        else {
            if (result.affectedRows != 0) {
                var insertedId = result.insertId
                res.send({ success: true, message: "Updated work experience", insertedId })
            }
            else {
                res.send({ success: false, message: "Unable to updated work experience" })
            }
        }
    })
})

router.delete('/deleteWorkExperience/:employment_id', (req, res) => {
    console.log(req.params.employment_id)
    var sql = `delete from employment WHERE employment_id =?`
    connection.query(sql, req.params.employment_id, (err, result) => {
        if (err) {
            console.log(err)
            return;
        }
        if (result.affectedRows != 0) {
            res.send({ success: true })
        }
        else {
            res.send({ success: false, message: "Unable to delete" })
        }
    })
})

router.get('/getEmployer/:userprofile_id', (req, res) => {
    var sql = `select employment_id, company_name, company_role,DATE_FORMAT(start_date, "%Y/%m/%d") as start_date, DATE_FORMAT(end_date, "%Y/%m/%d") as end_date,userprofile_id
                from employment
                where userprofile_id=?
                order by start_date desc`
    connection.query(sql, req.params.userprofile_id, (err, result) => {
        if (err) console.log(err)
        if (result.length > 0) {
            res.send({ success: true, result })
        }
        else {
            res.send({ success: false, message: "No profile found" })
        }
    })
})

// =========================================Qualification=================================================//
router.post("/addQualification", (req, res) => {
    const sql_body_qualification = [req.body.institution_name, req.body.qualification_type, req.body.qualification_name, req.body.start_date, req.body.end_date, req.body.userprofile_id]
    const sql_qualification = `insert into qualification(institution_name,qualification_type,qualification_name,start_date,end_date,userprofile_id)
                                values(?,?,?,?,?,?)`
    connection.query(sql_qualification, sql_body_qualification, (err, result) => {
        if (err) { console.log(err); return }
        if (result.affectedRows != 0) {
            res.send({ success: true, message: "Added qualification successfully" })
        }
        else {
            res.send({ success: false, message: "Unable to update some records, but you can add them later" })
        }
    })
})

router.get('/getQualification/:userprofile_id', (req, res) => {
    var sql = `select qualification_id, institution_name,qualification_type,qualification_name,DATE_FORMAT(start_date, "%Y/%m/%d") as start_date, DATE_FORMAT(end_date, "%Y/%m/%d") as end_date,userprofile_id
                from qualification
                where userprofile_id=?
                order by start_date desc`
    connection.query(sql, req.params.userprofile_id, (err, result) => {
        if (err) console.log(err)
        if (result.length > 0) {
            res.send({ success: true, result })
        }
        else {
            res.send({ success: false, message: "No profile found" })
        }
    })
})

router.put("/updateQualification/:qualification_id", (req, res) => {
    const sql_body = [req.body.qualification_type, req.body.qualification_name, req.body.start_date, req.body.end_date, req.params.qualification_id]
    const sql = `update qualification
                set qualification_type=?,
                qualification_name=?,
                start_date=?,
                end_date=?
                where qualification_id=?
                `
    connection.query(sql, sql_body, (err, result) => {
        if (err) console.log(err)
        else {
            if (result.affectedRows != 0) {
                var insertedId = result.insertId
                res.send({ success: true, message: "Updated qualification", insertedId })
            }
            else {
                res.send({ success: false, message: "Unable to updated qualification" })
            }
        }
    })
})

router.delete('/deleteQualification/:qualification_id', (req, res) => {
    console.log(req.params.employment_id)
    var sql = `delete from qualification WHERE qualification_id =?`
    connection.query(sql, req.params.qualification_id, (err, result) => {
        if (err) {
            console.log(err)
            return;
        }
        if (result.affectedRows != 0) {
            res.send({ success: true })
        }
        else {
            res.send({ success: false, message: "Unable to delete" })
        }
    })
})

router.get('/get_qualification', (req, res) => {
    var sql = `select COUNT(qualification_type) as count_quali, qualification_type
                from qualification
                GROUP by qualification_type`;
    connection.query(sql, (err, result) => {
        if (err) console.log(err)
        if (result.length > 0) {
            res.send({ success: true, result })
        }
        else {
            res.send({ success: false, message: "No profile found" })
        }
    })
})

router.get('/get_user_profile/:user_profile_id', (req, res) => {
    var sql = "select bio, userprofile_id, location, profile_pic from userprofile where alumni_id =?"
    connection.query(sql, req.params.user_profile_id, (err, result) => {
        if (err) console.log(err)
        if (result.length > 0) {
            res.send({ success: true, result })
        }
        else {
            res.send({ success: false, message: "No profile found" })
        }
    })
})

router.get('/alumniList', (req, res) => {
    const sql = `select alumni_name, al.alumni_id, alumni_surname, email,mobileNo, company, position , employ_type
                    from alumni al, userprofile up
                    where al.alumni_id = up.alumni_id
                    and role = 'alumni'`
    connection.query(sql, (err, result) => {
        if (err) console.log(err)
        else {
            if (result.length > 0) {
                res.send({ success: true, result })
            }
            else {
                res.send({ success: false, message: "No events found" })
            }
        }
    })
})

module.exports = router