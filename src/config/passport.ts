import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config();

interface CustomProfile extends Profile {
  accessToken: string;
  refreshToken: string;
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email", "https://www.googleapis.com/auth/calendar"],
    },
    (accessToken, refreshToken, profile, done) => {
      const customProfile: CustomProfile = {
        ...profile,
        accessToken,
        refreshToken,
      };

      customProfile.accessToken = accessToken;
      customProfile.refreshToken = refreshToken;
      return done(null, customProfile);
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});
