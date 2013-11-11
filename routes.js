function setup(app, handlers) {
  app.get("/login/success", handlers.passport.authenticate("dropbox"),
      handlers.application.login);

  app.get("/auth/facebook", handlers.passport.authorize("facebook", {
    scope: "publish_stream",
    failureRedirect: "/error"
  }));
  app.get("/auth/facebook/success", handlers.passport.authorize("facebook", {
    failureRedirect: "/error"
  }), handlers.application.fbUpload);
  app.get("/logout", handlers.application.logout);


  // app
  app.get("/", handlers.application.index);
  app.get("/home", handlers.application.auth, handlers.application.home);
  app.get("/error", handlers.application.error);
  app.get("/login", handlers.passport.authenticate("dropbox"));
  app.get("/all", handlers.application.auth, handlers.photo.all);
  app.get("/help", handlers.application.help);

  // album
  app.get("/albums", handlers.application.auth, handlers.album.all);
  app.get("/albums/new", handlers.application.auth, handlers.album.createForm);
  app.get("/albums/:album", handlers.application.auth, handlers.album.view);
  app.post("/albums", handlers.application.auth, handlers.album.create);
  app.delete("/albums/:album", handlers.application.auth, handlers.album.destroy);

  // photo
  app.get("/photos/all", handlers.application.auth, handlers.photo.all);
  app.get("/photos/:album/:photo", handlers.application.auth, handlers.photo.get);
  app.get("/photos/:photo", handlers.application.auth, handlers.photo.get);
  app.post("/photos", handlers.application.auth, handlers.photo.upload);
  app.post("/photos/:album", handlers.application.auth, handlers.photo.upload);
  app.post("/move", handlers.application.auth, handlers.photo.move);
  app.put("/photos/:album/:photo", handlers.photo.update);
  app.put("/photos/:photo", handlers.photo.update);

  app.get("/public/photos/:path", handlers.application.auth, handlers.photo.getPublicUrl);
  app.get("/edit/:album/:photo", handlers.application.auth, handlers.photo.edit);
  app.get("/edit/:photo", handlers.application.auth, handlers.photo.edit);
}

exports.setup = setup;
