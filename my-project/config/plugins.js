module.exports = ({ env }) => ({
  scheduler: {
    enabled: true,
    config: {
      contentTypes: {
        "api::course.course": {},
      },
    },
  },
});
