"use strict";

/**
 * A set of functions called "actions" for `course`
 */

module.exports = {
  course: async (ctx, next) => {
    const { id } = ctx.params;
    try {
      const entries = await strapi.entityService.findOne(
        "api::course.course",
        id,
        {
          fields: [
            "name",
            "subject",
            "description",
            "oneLineDescription",
            "class",
            "preRequisite",
          ],
          //   filters: { subject: subject, class: currentClass },
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
