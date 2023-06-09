"use strict";
const jwt = require("jsonwebtoken");

module.exports = {
  learnvideo: async (ctx, next) => {
    try {
      const { courseId, videoId } = ctx.params;
      let token = ctx.request.headers.authorization;
      console.log("learn video token is ", token);
      if (!token) {
        ctx.response.status = 401;
        ctx.body = "Unauthorized: Missing authorization header";
        return;
      }

      let statusCode;
      let responseData;
      token = token.split(" ");
      if (token[0] !== "Bearer" && token[1]) {
        ctx.response.status = 401;
        ctx.body = "Unauthorized: Invalid authorization header format";
        return;
      }

      token = token[1];
      let userId;
      let courseContentResponse;

      jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
        if (err || !decoded || !decoded.id) {
          ctx.response.status = 401;
          ctx.body = "Unauthorized: Invalid token";
          return;
        }
        userId = decoded.id;
      });

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

      if (isCoursePurchased) {
        let videoContent = courseContentResponse.courseContent.flatMap(
          (content) =>
            content.chapterContent.filter((content) => content.id == videoId)
        );
        responseData = videoContent[0];
      } else {
        let contentOfCourse = courseContentResponse.courseContent.map(
          (content, index) => {
            return content.chapterContent.map((content) => {
              if (content.isFree) {
                return content;
              } else {
                delete content.url;
                return content;
              }
            });
          }
        );

        let matchedObject = null;
        for (const item of contentOfCourse) {
          matchedObject = item.find((content) => content.id == videoId);
          if (matchedObject) {
            break;
          }
        }

        responseData = matchedObject;
      }

      ctx.response.status = 200;
      ctx.body = responseData;
    } catch (err) {
      console.log(err);
      ctx.response.status = 500;
      ctx.body = "Internal Server Error";
    }
  },
};
