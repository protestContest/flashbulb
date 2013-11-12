function setup(app, h) {
  app.get("/login/success", h.passport.authenticate("dropbox"), h.app.login);

  app.get("/auth/facebook", h.passport.authorize("facebook", {
    scope: "publish_stream",
    failureRedirect: "/error"
  }));
  app.get("/auth/facebook/success", h.passport.authorize("facebook", {
    failureRedirect: "/error"
  }), h.app.fbUpload);
  app.get("/logout", h.app.logout);


  // app
  app.get("/", h.app.index);
  app.get("/home", h.app.auth, h.app.home);
  app.get("/error", h.app.error);
  app.get("/login", h.passport.authenticate("dropbox"));
  app.get("/all", h.app.auth, h.photo.all);
  app.get("/help", h.app.help);

  // album
  app.get("/albums", h.app.auth, h.album.all);
  app.get("/albums/new", h.app.auth, h.album.createForm);
  app.get("/albums/:album", h.app.auth, h.album.view);
  app.post("/albums", h.app.auth, h.album.create);
  app.delete("/albums/:album", h.app.auth, h.album.destroy);

  // photo
  app.get("/photos/all", h.app.auth, h.photo.all);
  app.get("/photos/:album/:photo", h.app.auth, h.photo.get);
  app.get("/photos/:photo", h.app.auth, h.photo.get);
  app.post("/photos", h.app.auth, h.photo.upload);
  app.post("/photos/:album", h.app.auth, h.photo.upload);
  app.post("/move", h.app.auth, h.photo.move);
  app.put("/photos/:album/:photo", h.photo.update);
  app.put("/photos/:photo", h.photo.update);

  app.get("/public/photos/:path", h.app.auth, h.photo.getPublicUrl);
  app.get("/edit/:album/:photo", h.app.auth, h.photo.edit);
  app.get("/edit/:photo", h.app.auth, h.photo.edit);
}

exports.setup = setup;
