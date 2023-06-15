"use strict";

/**
 * A set of functions called "actions" for `course`
 */
const jwt = require("jsonwebtoken");

module.exports = {
  learnvideo: async (ctx, next) => {
    const { courseId, videoId } = ctx.params;
    let token = ctx.request.headers.authorization;
    token = token.split(" ");
    let statusCode;
    let responseData;

    token = token[1];
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
          (course) => course.id == courseId
        );

        courseContentResponse = await strapi.entityService.findOne(
          "api::course.course",
          courseId,
          {
            fields: [],
            //   filters: { subject: subject, class: currentClass },
            sort: { createdAt: "DESC" },
            populate: {
              courseContent: {
                populate: {
                  chapterContent: true,
                },
              },
            },
          }
        );
        console.log(courseContentResponse);
        if (isCoursePurchased) {
          let videoContent = courseContentResponse.courseContent.map(
            (content) => {
              content.chapterContent.filter((content) => content.id == videoId);
            }
          );

          responseData = videoContent;
        } else {
          let contentOfCourse = courseContentResponse.courseContent.map(
            (content, index) => {
              content.chapterContent.map((content) => {
                if (content.isFree) {
                  return content;
                } else {
                  delete content.url;
                  return content;
                }
              });
              return content;
            }
          );

          let matchedObject = null;
          for (const item of contentOfCourse) {
            matchedObject = item.chapterContent.find(
              (content) => content.id == videoId
            );
            if (matchedObject) {
              break;
            }
          }
          console.log("matchinges");
          responseData = matchedObject;
        }

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
