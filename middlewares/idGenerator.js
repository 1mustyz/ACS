const Staff = require('../models/staff')



exports.staffIdGenerator = async (req,res,next) => {
    // 1. check if there are staff
    const getStaff = await Staff.find()
    // 2. if no staff first id is admin

    let id;
    if (getStaff.length < 1) {
        id = 'ACRS/ADMIN/001'
        req.body.username = 'ACRS/ADMIN/001'
    } 
    else{
        // 3. if there are staffs get the last id and icrement by one
        const lastStaff = await Staff.find().sort({createdAt: -1}).limit(1)
        // console.log(lastStaff)

        let zeros
        id = lastStaff[0].username.split('/')
        
        if(req.body.role == 'staff'){

            req.body.username = `ACRS/STAFF/${zeros = id[2] < 10  && parseInt(id[2]) + 1 < 10 ? '00': id[2] >= 99 ? '':'0'}${parseInt(id[2]) + 1 }`
        }else if(req.body.role == 'admin'){
            req.body.username = `ACRS/ADMIN/${zeros = id[2] < 10  && parseInt(id[2]) + 1 < 10 ? '00': id[2] >= 99 ? '':'0'}${parseInt(id[2]) + 1 }`

        }else{
            res.json({"msg":"role not accepted"})
        }
    }
    console.log(id,req.body.username)

    // 4. then insert the new id
    next()
}

