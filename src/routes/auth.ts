import { Router, Request, Response } from "express";
import passport from "passport";

const router = Router();

// Start Google OAuth
router.get("/google", passport.authenticate("google", { session: true }));

// Callback route after login
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    session: true,
  }),
  (req: Request, res: Response) => {
    res.redirect(process.env.FRONTEND_URL!); // redirect to frontend after success
  }
);

router.get("/logout", (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.redirect(`${process.env.FRONTEND_URL!}/?logoutError=true`);
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid"); // clear session cookie
      return res.redirect(`${process.env.FRONTEND_URL!}/login`);
    });
  });
});

export default router;
