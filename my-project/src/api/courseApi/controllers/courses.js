"use strict";

/**
 * A set of functions called "actions" for `courses`
 */

module.exports = {
  courses: async (ctx, next) => {
    const { currentClass, subject } = ctx.request.body;
    try {
      const entries = await strapi.entityService.findMany(
        "api::course.course",
        {
          fields: ["name", "subject"],
          filters: { subject: subject, class: currentClass },
          sort: { createdAt: "DESC" },
          populate: { category: true },
        }
      );
      ctx.body = entries;
    } catch (err) {
      ctx.body = err;
    }
  },
};
