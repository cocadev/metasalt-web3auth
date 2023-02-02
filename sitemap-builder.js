require("babel-register")({
    presets: ["react", "env", "stage-0"]
  });
  const router = require('./src/components/router').default;
  const Sitemap = require('react-router-sitemap').default;
  (
      new Sitemap(router)
      .build("https://mi-awesome-website.com")
          .save('./public/sitemap.xml')
  );