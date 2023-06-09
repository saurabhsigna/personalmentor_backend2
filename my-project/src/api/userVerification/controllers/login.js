"use strict";

/**
 * A set of functions called "actions" for `login`
 */
const jwt = require("jsonwebtoken");
const auth = require("@strapi/admin/server/services/auth");

let id;
const expiresIn = "30d";
let token;

module.exports = {
  login: async (ctx, next) => {
    const { email, number, password } = ctx.request.body;
    let statusCode = 200;
    let user;

    if (email && password) {
      user = await strapi.entityService.findMany(
        "plugin::users-permissions.user",
        {
          filters: { email: email.toLowerCase() },
        }
      );
    } else if (number && password) {
      user = await strapi.entityService.findMany(
        "plugin::users-permissions.user",
        {
          filters: { mobileNumber: number },
        }
      );
    }
    try {
      if (user.length > 0) {
        console.log(user);
        console.log("user already present !");

        const passwordMatch = await auth.validatePassword(
          password,
          user[0].password
        );
        console.log(passwordMatch, password, user[0].password);
        if (!passwordMatch) {
          ctx.throw(400, "Invalid password");
        }
        const payload = {
          id: user[0].id,
        };
        token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
      }

      if (token && user) {
        let responseData = {
          verified: user[0]?.isVerified,
          token: token,
        };
        ctx.body = responseData;
      } else {
        ctx.response.status = 400;
        ctx.body = "userNotFound";
      }
    } catch (err) {
      ctx.response.status = 400;
      console.log(err.message);
      ctx.body = err;
    }
  },
};
