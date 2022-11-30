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
  ],
};
