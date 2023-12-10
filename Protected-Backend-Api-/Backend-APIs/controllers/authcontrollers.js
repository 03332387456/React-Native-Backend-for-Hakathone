const { SendResponse } = require("../helpers/helpers");
const UserModel = require("../models/authmodels")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const AuthController = {

  // Signup API 

  signUp: async (req, res) => {
    try {
      let { userName, password, contact , userType } = req.body;
      let obj = { userName, password, contact ,userType };
      let errArr = [];

      if (!obj.userName) {
        errArr.push("User Name is Required");
      }
      if (!obj.password) {
        errArr.push("Password is Required");
      }

      if (errArr.length > 0) {
        res.status(400).send(SendResponse(false, "Validation Error", errArr));
        return;
      }

      let userExist = await UserModel.findOne({ userName: obj.userName });

      if (userExist) {
        res
          .status(400)
          .send(SendResponse(false, "User Already Exist with this User Name"));
        return;
      }

      obj.password = await bcrypt.hash(obj.password, 10);

      let User = new UserModel(obj);
      let result = await User.save();

      if (result) {
        res
          .status(200)
          .send(SendResponse(true, "User Created Successfully", result));
      }
    } catch (error) {
      res.status(500).send(SendResponse(false, "Internal Server Error", error));
    }
  },

  // login API 

  login: async (req, res) => {
    try {
      let { userName, password } = req.body;
      let obj = { userName, password };
      let existingUser = await UserModel.findOne({ userName: obj.userName });

      if (existingUser) {
        let corerctPassword = await bcrypt.compare(
          obj.password,
          existingUser.password
        );

        if (corerctPassword) {
          let token = jwt.sign({ ...existingUser }, process.env.SECRET_KEY);

          res.send(
            SendResponse(true, "Login Successfully", {
              token: token,
              user: existingUser,
            })
          );
        } else {
          res.send(SendResponse(false, "Password Not Match"));
        }
      } else {
        res.send(SendResponse(false, "User Not Found with this User Name"));
      }
    } catch (error) { }
  },


  // Protected
  protected: (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      res.status(401).send(SendResponse(false, "Unauthorized"))
      return
    } else {
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          res.status(401).send(SendResponse(false, "Unauthorized"))
          return
        } else {
          // console.log(decoded);
          next()
          return
        }
      })
    }
  },
 
  // CheckAuth
  CheckAuth: async (req, res) => {
    try {
      let token = req.headers.authorization.replace("Bearer ", "");
      jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
        if (err) {
          res.status(401).send(SendResponse(false, "Unauthorized"));
        } else {
          res.status(200).send(SendResponse(true, "Authorized"));
        }
      });
    } catch (error) {
      res.status(500).send(SendResponse(false, "Internal Server Error", error));
    }
  },
  
  // get users
  getUsers: async (req, res) => {
  try {
    let result = await UserModel.find();
    if (result.length === 0) {
      res.status(404).send(SendResponse(false, "Data not Found", null));
    } else {
      res.status(200).send(SendResponse(true, "Data Found Successfully", result));
    }
  } catch (error) {
    res.status(500).send(SendResponse(false, "Internal server Error", error));
  }
},

//delete All users
delAllUsers: (async (req, res) => {
  try {
      const result = await UserModel.deleteMany({});
      if (result) {
          res.status(200).send(SendResponse(true, "record deleted Sucessfully", result))
      } else {
          res.status(404).send(SendResponse(false, "record not found"))
      }
  } catch (error) {
      res.status(500).send(SendResponse(false, "internal server error", error))
  }
}),

  // Admin Protected
  Adminprotected: (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      res.status(401).send(SendResponse(false, "UNAuthorized"))
      return
    } else {
      jwt.verify(token.process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          res.status(401).send(SendResponse(false, "UN Authorized"))
          return
        } else {
          if (decoded._doc.role == "admin") {
            next()
          }
          return
          // res.status(200).send(SendResponse(true, "Authorized"))
          // console.log(decoded);
        }
      })
    }
  },
};

module.exports = AuthController;