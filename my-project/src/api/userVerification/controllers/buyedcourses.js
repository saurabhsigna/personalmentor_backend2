"use strict";

const jwt = require("jsonwebtoken");

module.exports = {
  buyedcourses: async (ctx, next) => {
    let token = ctx.request.headers.authorization;
    token = token.split(" ");
    token = token[1];
    var id;
    let response;

    jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
      if (decoded.id) {
        id = decoded.id;
      }
    });

    try {
      const entry = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        id,
        {
          populate: {
            courses:{
              fields:["name"]
            }
          },
          fields: ["username"],
        }
      );
      ctx.body = entry;
    } catch (err) {
      ctx.body = err;
    }
  },
};
