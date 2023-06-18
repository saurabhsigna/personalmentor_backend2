module.exports = {
  routes: [
    {
      method: "POST",
      path: "/coursesinfo",
      handler: "courses.courses",
    },
    {
      method: "GET",
      path: "/course/:id",
      handler: "course.course",
    },
    {
      method: "GET",
      path: "/course/:courseId/learn/:videoId",
      handler: "learnvideo.learnvideo",
    },
  ],
};
