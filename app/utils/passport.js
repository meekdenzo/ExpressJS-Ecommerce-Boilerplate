const JwtStrategy = require('passport-jwt').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const appRoot = require('app-root-path');

const models = require(appRoot + '/app/database/models');
const { passkey, FACEBOOK_CONFIG } = require(appRoot + '/app/config/app.json');
const User = models.user;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = passkey;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findByPk(jwt_payload.user_id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: FACEBOOK_CONFIG.clientID,
        clientSecret: FACEBOOK_CONFIG.clientSecret,
        callbackURL: FACEBOOK_CONFIG.callbackURL
      },
      (accessToken, refreshToken, profile, done) => {
        User.findOrCreate(
          { where: { facebook_access_token: accessToken } },
          {
            defaults: {
              first_name: profile.first_name,
              last_name: profile.last_name,
              email: profile.email,
              role: 'CUSTOMER'
            }
          }
        ).then(user, created => {
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      }
    )
  );
};
