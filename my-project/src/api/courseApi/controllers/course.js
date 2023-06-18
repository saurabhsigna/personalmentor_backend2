"use strict";

/**
 * A set of functions called "actions" for `course`
 */

// Set the AWS credentials and region

// Create an instance of the S3 service

const jwt = require("jsonwebtoken");

module.exports = {
  course: async (ctx, next) => {
    const { id } = ctx.params;

    let token = ctx.request.headers.authorization;
    token = token?.split(" ");
    let statusCode;
    let responseData;
    console.log("token is ");
    console.log(token);
    token = token ? token[1] : "hootiya";
    let userId;
    let courseContentResponse;

    jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
      if (decoded && decoded.id) {
        userId = decoded.id;
      }
    });
    try {
      if (userId) {
        let userInfo = await strapi.entityService.findOne(
          "plugin::users-permissions.user",
          userId,
          {
            populate: {
              courses: true,
            },
          }
        );

        let isCoursePurchased = userInfo.courses.some(
          (course) => course.id == id
        );

        console.log("course presented ", isCoursePurchased);

        courseContentResponse = await strapi.entityService.findOne(
          "api::course.course",
          id,
          {
            fields: [
              "name",
              "subject",
              "description",
              "oneLineDescription",
              "thumbnail",
              "class",
              "preRequisite",
            ],
            //   filters: { subject: subject, class: currentClass },
            sort: { createdAt: "DESC" },
            populate: {
              teacher: {
                fields: ["name", "oneLineIntroduction", "image"],
              },
              courseContent: {
                populate: { chapterContent: true },
              },
            },
          }
        );

        if (isCoursePurchased) {
          courseContentResponse.isPurchased = true;
        } else {
          console.log(isCoursePurchased, " dhandha");
          let contentOfCourse = courseContentResponse.courseContent.map(
            (content, index) => {
              content.chapterContent.map((contentOfChapter) => {
                if (contentOfChapter?.isFree) {
                  return contentOfChapter;
                } else {
                  delete contentOfChapter?.url;
                  return contentOfChapter;
                }
              });
              return content;
            }
          );
          console.log(contentOfCourse);
          courseContentResponse.isPurchased = false;
          courseContentResponse.courseContent = contentOfCourse;
        }

        responseData = courseContentResponse;
        statusCode = 200;
      } else {
        statusCode = 403;
        responseData = "unauthorized";
      }
      ctx.response.status = statusCode;
      ctx.body = responseData;
    } catch (err) {
      console.log(err);
      ctx.body = err;
    }
  },
};
