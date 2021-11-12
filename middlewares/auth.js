//check if user is logged in && the user is not trying to access unauthorised data
exports.isStaffLoggedIn = function (role) {
    return (req, res, next) => {
      if (req.isAuthenticated()) {
        return res.json({ success: true, message: 'valid staff', user: req.user })
      }else{
      res.json({ success: false, message: 'unauthorized or authenticated staff', user: req.user})
    }
  }
  }

