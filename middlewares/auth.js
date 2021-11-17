//check if user is logged in && the user is not trying to access unauthorised data
exports.isAdminLoggedIn = function () {
    return (req, res, next) => {
      if (req.isAuthenticated() && req.user.role == "admin") {
        return res.json({ success: true, message: 'valid admin', user: req.user })
        
      }else{
      res.json({ success: false, message: 'unauthorized or authenticated admin', user: req.user})
    }
  }
  }


  exports.isStaffLoggedIn = function (role) {
    return (req, res, next) => {
      if (req.isAuthenticated() && req.user.role == "staff") {
        return res.json({ success: true, message: 'valid staff', user: req.user })
      }else{
      res.json({ success: false, message: 'unauthorized or authenticated staff', user: req.user})
    }
  }
  }

