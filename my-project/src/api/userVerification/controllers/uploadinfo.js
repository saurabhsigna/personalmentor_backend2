"use strict";
const jwt = require("jsonwebtoken");

module.exports = {
  uploadinfo: async (ctx, next) => {
    let statusCode = 200;
    const { name, address, imgAvatar, mobileNum, age, currentClass, board } =
      ctx.request.body;
    let token = ctx.request.headers.authorization;
    token = token.split(" ");
    token = token[1];
    var id;
    let response;

    function validateMobileNumber(number) {
      const regex = /^[6-9]\d{9}$/; // Matches a 10-digit number starting with 6, 7, 8, or 9

      return regex.test(number);
    }
    jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
      if (decoded.id) {
        id = decoded.id;
      }
    });
    try {
      await strapi.entityService
        .findOne("plugin::users-permissions.user", id, {
          fields: ["isVerified", "username"],
        })
        .then(async (res) => {
          if (
            currentClass &&
            age &&
            name &&
            imgAvatar &&
            address &&
            mobileNum &&
            validateMobileNumber(mobileNum) &&
            board &&
            !res.isVerified
          ) {
            await strapi.entityService
              .update("plugin::users-permissions.user", res.id, {
                data: {
                  age,
                  class: currentClass,
                  address,
                  imgAvatar,
                  role: 1,
                  fullName: name,
                  mobileNumber: mobileNum,
                  isVerified: true,
                  board: board,
                  confirmed: true,
                },
              })
              .then((res) => {
                console.log("sucks");
                response = "sucess";
              })
              .catch((err) => {
                statusCode = 400;
                response = "some invalid data (eg. mobile Number)";
                console.log("fucked up");
                console.log(err.message);
              });

            console.log("dd inside good");
          } else if (!res.verified && validateMobileNumber(mobileNum)) {
            statusCode = 400;
            response = "enter every property";
          } else if (!validateMobileNumber(mobileNum)) {
            statusCode = 400;
            response = "enter correct mobile num";
          }
          if (res.isVerified) {
            statusCode = 400;
            response = "you are verified ";
          }
        });
      console.log("dd data is : ");
      console.log(statusCode, response);
      ctx.status = statusCode;
      ctx.body = { response };
    } catch (err) {
      console.log(err.message);
      ctx.body = err;
    }
  },
};
