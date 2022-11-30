"use strict";

/**
 * A set of functions called "actions" for `leaduser`
 */

module.exports = {
  leaduser: async (ctx, next) => {
    const { name, number, currentClass } = ctx.request.body;
    let apiStatus = 200;
    let apiResponse = "";
    const makeLeadUser = async () => {
      await strapi.entityService.create("api::lead-user.lead-user", {
        data: {
          name,
          class: currentClass,
          phoneNumber: number,
        },
      });
    };
    try {
      if (name && number && currentClass) {
        console.log("is this running or not ");
        const isNumAlreadyPresent = await strapi.entityService.findMany(
          "api::lead-user.lead-user",
          {
            filters: { phoneNumber: number },
          }
        );
        if (isNumAlreadyPresent) {
          apiStatus = 400;
          apiResponse = "number already present";
        } else {
          await strapi.entityService.create("api::lead-user.lead-user", {
            data: {
              name,
              class: currentClass,
              phoneNumber: number,
            },
          });
        }
      } else {
        apiResponse = "enter every property";
        apiStatus = 400;
      }
      ctx.response.status = apiStatus;
      ctx.body = apiResponse;
    } catch (err) {
      apiStatus = 500;
      ctx.response.status = apiStatus;
      ctx.body = err;
    }
  },
};
