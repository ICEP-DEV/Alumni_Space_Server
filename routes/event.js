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

// router.post('/addEvent', upload.single('image'), (req, res) => {
//     console.log(req.body);
//     const sql_body = [req.body.eventName, req.body.organization, req.file.filename, req.body.donationFee, req.body.description, req.body.venue, req.body.startDate, req.body.endDate]
//     const sql = `INSERT INTO event_poster ( eventName, organization, image, donationFee, description, venue, startDate, endDate) 
//                 VALUES (?, ?, ?, ?, ?, ?, ?, ?);`
             
//     connection.query(sql, sql_body, (err, result) => {
//         if (err) {
//             console.log(err)
//         }
//         else {
//             if (result.affectedRows != 0) {
//                 var insertedId = result.insertId
//                 res.send({ success: true, message: "event data recorded...", insertedId })
//             }
//             else {
//                 res.send({ success: false, message: "unable to record event..." })
//             }
//         }
//     })
    
// })
router.post('/addEvent', upload.single('image'), (req, res) => {
    const eventName = req.body.eventName;
    const organization = req.body.organization;
    const description = req.body.description;
    const donationFee = req.body.donationFee;
    const venue = req.body.venue;
    // Parse the date string into a JavaScript Date object
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);
    // Convert the client date to the server's time zone (e.g., 'Africa/Johannesburg')
    
    let image = "";
    if (req.file) {
      image = `http://localhost:${process.env.PORT}/api/uploads/${req.file.filename}`;
    }
  
    let sql = `INSERT INTO event_poster ( eventName, organization, image, donationFee, description, venue, startDate, endDate) 
      VALUES('${eventName}', '${organization}','${image}', '${donationFee}', '${description}','${venue}', '${startDate.toISOString()}','${endDate.toISOString()}')`;
  
    connection.query(sql, (err, results) => {
      if (err) {
        return res.status(400).send("Failed to add events!" + err);
      } else {
        return res.status(200).send("Events added successfully");
      }
    });
  });



router.get('/getEventsList', (req, res) => {
    var sql = "select * from event_poster where startDate > NOW()";
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

router.get('/alumni_subscribes', (req, res) => {
    const sql = `SELECT alumni_event_id, isAttend, isDonated, eventName
                    from alumni_event ae, event_poster ep
                    where ae.event_id = ep.event_id`
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


router.put('/updateEvent/:event_id', upload.single('image'), (req, res) => {
    const sql_body = [req.body.eventName, req.body.organization, req.file.filename, req.body.donationFee, req.body.description, req.body.venue, req.body.startDate, req.body.endDate, req.params.event_id]

    var sql = `update event_poster
                set eventName=?,
                organization=?,
                image =?,
                donationFee=?,
                description=?,
                venue=?,
                startDate=?,
                endDate=?
                where event_id=?`;
    connection.query(sql, sql_body, (err, result) => {
        if (err) console.log(err)
        else {
            if (result.affectedRows != 0) {
                var insertedId = result.insertId
                res.send({ success: true, message: "event data is updated", insertedId })
            }
            else {
                res.send({ success: false, message: "unable to update event..." })
            }
        }
    })
})

router.post('/addAlumniEvent', function (req, res) {
    const sql_body = [req.body.isAttend, req.body.isDonated, req.body.event_id, req.body.alumni_id]
    const sql = `INSERT INTO alumni_event ( isAttend, isDonated, event_id, alumni_id) 
                VALUES ( ?, ?, ?, ?)`;

    connection.query(sql, sql_body, (err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            if (result.affectedRows != 0) {
                var insertedId = result.insertId
                res.send({ success: true, message: "event attendance filled", insertedId })
            }
            else {
                res.send({ success: false, message: "unable to event attendance..." })
            }
        }
    })

})

router.get('/getEvents', (req, res) => {
    var sql = `SELECT event_id,eventName, organization, image, donationFee, description, venue, 
                DATE_FORMAT(startDate, "%d/%m/%Y") as startDate, DATE_FORMAT(endDate, "%d/%m/%Y") as endDate, DATE_FORMAT(startDate, "%H:%i") as startTime, 
                DATE_FORMAT(endDate, "%H:%i") as endTime, startDate as initialDate, endDate as lastDate
                from event_poster
                where startDate > NOW()
                and is_deleted = false`
    connection.query(sql, req.params.alumniId, (err, result) => {
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

router.put('/disable_event/:event_id', (req,res)=>{
    const sql = `update event_poster
                set is_deleted = true
                where event_id =?`
    connection.query(sql, req.params.event_id, (err, result)=>{
        if(err) {
            console.log(err)
            return
        }
        if(result.affectedRows !=0){
            res.send({success:true, message:'Event removed'})
        }
        else{
            res.send({success:false, message:'Unable to remove event'})
        }
    })
})


module.exports = router