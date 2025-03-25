const { promisify } = require("util");
const User = require("./../models/userModel.js");
const catchAsync = require("./../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError.js");

const signToken = id => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

exports.signup = catchAsync(
  async (req, res, _next) => {
    const newUser = await User.create(req.body);

    const token = signToken(newUser._id);

    res.status(201).json({
      status: "Success",
      token,
      data: {
        user: newUser,
      },
    });
  }
);

exports.login = catchAsync(
  async (req, res, next) => {
    const { email, password } = req.body;
    //Check Exists
    if (!email || !password) {
      return next(
        new Error(
          "Please Provide email and password",
          400
        )
      );
    }
    //Check If correct
    const user = await User.findOne({
      email,
    }).select("+password");

    if (
      !user ||
      !(await user.correctPassword(
        password,
        user.password
      ))
    ) {
      return next(
        new Error(
          "Incorrect email or password",
          401
        )
      );
    }

    //Send Token
    const token = signToken(user._id);

    res.status(200).json({
      status: "Success",
      token,
    });
  }
);

exports.protect = catchAsync(
  async (req, res, next) => {
    //Get Token and Check
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith(
        "Bearer"
      )
    ) {
      token =
        req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new Error(
          "You are not logged in! You must be logged in to get access.",
          401
        )
      );
    }

    //Verification
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );

    //Check If Still Exists
    const decodedUser = await User.findById(
      decoded.id
    );

    if (!decodedUser) {
      return next(
        new AppError(
          "The user belonging to this token no longer exists!",
          401
        )
      );
    }

    //Check if user changed password
    if (
      decodedUser.changedPassword(decoded.iat)
    ) {
      return next(
        new AppError(
          "User Recently Changed password. Please login again!",
          401
        )
      );
    }

    //Access now granted to route
    req.user = decodedUser;
    next();
  }
);

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles ["admin",'moderator]
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You do not have permission to perform this action",
          403
        )
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(
  async (req, res, next) => {
    //Get user email
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user)
      return next(
        new AppError(
          "There is no user with that email!",
          404
        )
      );
    ///Generate reset token
    const resetToken =
      user.createPasswordResetToken();

    await user.save({
      validateBeforeSave: false,
    });
    //Send token to users email

    next();
  }
);
exports.resetPassword = (req, res, next) => {};

module.exports;
