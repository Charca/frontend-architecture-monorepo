module.exports = {
  forbidden: [
    {
      name: "app-not-to-app",
      comment:
        "One app should not depend on another app",
      severity: "error",
      from: { path: "(^apps/)([^/]+)/" },
      to: { path: "^$1", pathNot: "$1$2" },
    },
  ],
  options: {
    doNotFollow: {
      path: "node_modules",
    },
    exclude: {
      path: "(^|/)(dist|node_modules)/",
    },
  },
};
