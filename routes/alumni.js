const express = require('express');
const router = express.Router();
const connection = require('./../database/database')
const multer = require('multer');

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

router.post("/login", (req, res) => {
    const sql = `select alumni_id, alumni_name, alumni_surname, role, email, password, mobileNo
    from alumni
    where email =?`

    connection.query(sql, req.body.email, (err, result) => {
        if (err) {
            console.log(err)
            return
        }
        if (result.length > 0) {
            if (result[0].password == req.body.password) {
                console.log('success')

                res.send({ success: true, result })
            }
            else {
                console.log('Wrong username or password')

                res.send('Wrong username or password')
            }
        }
        else {
            console.log('Wrong username or password')
            res.send('Wrong username or password')
        }
    })
})
/*
router.get("/get_user_profile/:alumni_id", (req, res) => {
    var sql_profile = `select * 
                        from userprofile
                        where alumni_id =?`
    connection.query(sql_profile, req.params.alumni_id, (error, result) => {
        if (error) console.log(error);
        if (result.length > 0) {
            res.send({ success: true, result })
        }
        else {
            res.send({ success: false, message: "Add profile" })
        }
    })
})
*/
router.post("/addAlminiProfile", upload.single('image'), (req, res) => {
    console.log(req.body.interests.split(","))
    var interest_name = req.body.interests.split(",")

    var image_name = "default.png"
    if (req.file != undefined) {
        image_name = req.file.filename
    }
    console.log(image_name)

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

router.post('/addWorkExperience', (req, res) => {
    const sql_body_work_experience = [req.body.comapny_name, req.body.company_role, req.body.start_date, req.body.end_date, req.body.userprofile_id]
    const sql_work_experience = `insert into employment(comapny_name, company_role,start_date,end_date,userprofile_id)
                                    values(?,?,?,?,?)`

    connection.query(sql_work_experience, sql_body_work_experience, (err, result) => {
        if (err) { console.log(err); return }
        if (result.affectedRows != 0) {
            res.send({ success: true, message: "Added work experience successfully" })
        }
        else {
            res.send({ success: false, message: "Unable to update some records, but you can add them later" })
        }
    })
})

router.get('/getEmployer/:userprofile_id', (req, res) => {
    var sql = `select *
                from employment
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

router.post("/addQualification", (req, res) => {
    const sql_body_qualification = [req.body.institution_name,req.body.qualification_type, req.body.qualification_name, req.body.start_date, req.body.end_date, req.body.userprofile_id]
    const sql_qualification = `insert into qualification(institution_name,qualification_type,qualification_name,start_date,end_date,userprofile_id)
                                values(?,?,?,?,?)`
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
    var sql = `select *
                from qualification
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

router.put("/updateWorkExperience/:employment_id", (req, res) => {
    const sql_body = [req.body.comapny_name, req.body.company_role, req.body.start_date, req.body.end_date, req.params.employment_id]
    const sql = `update employment
                set comapny_name=?,
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


module.exports = router