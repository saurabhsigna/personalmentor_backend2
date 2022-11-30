"use strict";

/**
 * A set of functions called "actions" for `register`
 */
const jwt = require("jsonwebtoken");

module.exports = {
  register: async (ctx, next) => {
    const { email, password } = ctx.request.body;
    let id;
    const expiresIn = "30d";
    const statusCode = 200;
    let token;
    try {
      const isUserAlreadyPresent = await strapi.entityService.findMany(
        "plugin::users-permissions.user",
        {
          filters: { email: email },
        }
      );

      if (isUserAlreadyPresent.length > 0) {
        console.log(isUserAlreadyPresent);
        console.log("user already present !");
      } else {
        await strapi.entityService
          .create("plugin::users-permissions.user", {
            data: {
              username: email,
              fullName: "",
              mobileNumber:
                Math.floor(Math.random() * (442332 - 12011 + 1)) + 12011,
              email: email,
              role: 1,
              password: password,
              provider: "local",
            },
          })
          .then((res) => {
            console.log("response is =>");
            console.log(res);
            id = res.id;
            const payload = {
              id: id,
            };
            token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
          });
      }
      if (token) {
        ctx.response.status = statusCode;
        ctx.body = token;
      } else {
        ctx.response.status = 400;
        console.log("user is already maked ");
        ctx.body = "userAlreadyPresent";
      }
    } catch (err) {
      ctx.response.status = 401;
      console.log(err.message);
      ctx.body = err;
    }
  },
};
