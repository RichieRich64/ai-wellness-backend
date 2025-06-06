import express from "express";
import { Router, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import "./config/passport";
import authRoutes from "./routes/auth";
import calendarRoutes from "./routes/calendar";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax", // or "none" if you’re using HTTPS
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "health OK!" });
});

// Routes
app.use("/auth", authRoutes);
app.use("/calendar", calendarRoutes);

// Google Add-on trigger handler
app.all("/calendar-add-on/homepage", (req, res) => {
  // Respond with Google Card JSON for homepage trigger

  res.json({
    action: {
      navigations: [
        {
          pushCard: {
            sections: [
              {
                header: "AI Wellness",
                widgets: [
                  {
                    decoratedText: {
                      text: "Your personal energy-based calendar helper",
                      wrapText: true,
                    },
                  },
                  {
                    decoratedText: {
                      text: "AI Wellness",
                      icon: {
                        iconUrl:
                          "https://ssl.gstatic.com/docs/script/images/logo/script-64.png",
                      },
                    },
                  },
                  {
                    buttonList: {
                      buttons: [
                        {
                          text: "Get Started",
                          color: {
                            red: 0.21,
                            green: 0.83,
                            blue: 0.6,
                            alpha: 1,
                          },
                          onClick: {
                            openLink: {
                              url: "https://ai-wellness-p9n5.onrender.com",
                            },
                          },
                        },
                        {
                          text: "Skip Setup",
                          color: {
                            red: 0.23,
                            green: 0.51,
                            blue: 0.96,
                            alpha: 1,
                          },
                          onClick: {
                            action: {
                              function:
                                "https://ai-wellness-backend-pbxw.onrender.com/calendar-add-on/handleSkipSetup",
                            },
                          },
                        },
                      ],
                    },
                  },
                  {
                    textInput: {
                      name: "event_title",
                      label: "Event Title",
                      hintText: "E.g. Make breakfast",
                    },
                  },
                  {
                    buttonList: {
                      buttons: [
                        {
                          text: "Schedule Event",
                          color: {
                            red: 0.21,
                            green: 0.83,
                            blue: 0.6,
                            alpha: 1,
                          },
                          onClick: {
                            openLink: {
                              url: "https://ai-wellness-p9n5.onrender.com",
                            },
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  });
});

app.all("/calendar-add-on/handleSkipSetup", (req, res) => {
  res.json({
    action: {
      navigations: [
        {
          pushCard: {
            sections: [
              {
                header: "Schedule Events",
                widgets: [
                  {
                    decoratedText: {
                      text: "Setup has been skipped. Welcome to the schedule events view!",
                      wrapText: true,
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  });
});

// // Google Add-on trigger handler....
// app.all("/calendar-add-on/homepage", (req, res) => {
//   // Respond with Google Card JSON for homepage trigger....

//   res.json({
//     action: {
//       navigations: [
//         {
//           pushCard: {
//             sections: [
//               {
//                 header: "AI Wellness",
//                 widgets: [
//                   {
//                     decoratedText: {
//                       text: "Your personal energy-based calendar helper",
//                       wrapText: true,
//                     },
//                   },
//                   {
//                     decoratedText: {
//                       text: "AI Wellness Calendar Assistan",
//                     },
//                   },
//                   {
//                     decoratedText: {
//                       text: "AI Wellness",
//                       icon: {
//                         iconUrl:
//                           "https://ssl.gstatic.com/docs/script/images/logo/script-64.png",
//                       },
//                     },
//                   },
//                 ],
//               },
//             ],
//           },
//         },
//       ],
//     },
//   });
// });

// app.all("/calendar-add-on/homepage", (req, res) => {
//   const card = {
//     header: {
//       title: "AI Wellness Calendar Assistant",
//       subtitle: "Hello World",
//     },
//     sections: [
//       {
//         widgets: [
//           {
//             textParagraph: {
//               text: "Hello World",
//             },
//           },
//         ],
//       },
//     ],
//   };

//   res.json({
//     renderActions: {
//       actions: [
//         {
//           navigations: [
//             {
//               pushCard: card,
//             },
//           ],
//         },
//       ],
//     },
//   });
// });

// // Google Add-on trigger handler
// app.all("/calendar-add-on/homepage", (req, res) => {
//   // Respond with Google Card JSON for homepage trigger
//   const card = {
//     header: {
//       title: "AI Wellness Calendar Assistant",
//       subtitle: "Your personal energy-based calendar helper",
//       imageUrl: "https://ssl.gstatic.com/docs/script/images/logo/script-64.png",
//       imageStyle: "AVATAR",
//     },
//     sections: [
//       {
//         widgets: [
//           {
//             textParagraph: {
//               text: "Click the button below to open AI Wellness Calendar Assistant.",
//             },
//           },
//           {
//             // Corrected from "buttons" to "buttonList" which contains "buttons"
//             buttonList: {
//               buttons: [
//                 {
//                   text: "Open App", // For a TextButton, 'text' is a direct child
//                   onClick: {
//                     openLink: {
//                       url: "https://ai-wellness-p9n5.onrender.com/",
//                     },
//                   },
//                 },
//               ],
//             },
//           },
//         ],
//       },
//     ],
//   };

//   res.json({
//     actions: [
//       {
//         navigations: [
//           {
//             pushCard: card,
//           },
//         ],
//       },
//     ],
//   });
// });

// Google Add-on trigger handler
// app.get("/calendar-add-on/homepage", (req, res) => {
// app.post("/calendar-add-on/homepage", (req, res) => {
//   // Respond with Google Card JSON for homepage trigger
//   const cardResponse = {
//     cards: [
//       {
//         header: {
//           title: "AI Wellness Calendar Assistant",
//           subtitle: "Your personal energy-based calendar helper",
//           imageUrl: "https://yourdomain.com/logo.png",
//           imageStyle: "AVATAR",
//         },
//         sections: [
//           {
//             widgets: [
//               {
//                 textParagraph: {
//                   text: "Click the button below to open AI Wellness Calendar Assistant.",
//                 },
//               },
//               {
//                 buttons: [
//                   {
//                     textButton: {
//                       text: "Open App",
//                       onClick: {
//                         openLink: {
//                           url: "https://ai-wellness-p9n5.onrender.com/",
//                         },
//                       },
//                     },
//                   },
//                 ],
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   };

//   res.json(cardResponse);
//   return;
// });

app.get("/me", (req, res) => {
  if (!req.user) {
    res.status(401).send("Not logged in");
    return;
  }
  res.send(req.user);
});

app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);
