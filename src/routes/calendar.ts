import { Router, Request, Response } from "express";
import { google } from "googleapis";

const router = Router();

router.get("/sync", async (req: Request, res: Response) => {
  const user = req.user as any;

  if (!user || !user.accessToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: user.accessToken,
    });

    // Create Google Calendar API instance
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    // Fetch the user's events from the calendar
    const result = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(), // Get events from current time onwards
      maxResults: 10, // Limit number of events
      singleEvents: true,
      orderBy: "startTime",
    });

    res.json(result.data.items);
  } catch (err) {
    console.error("Calendar API error:", err);
    res.status(500).json({ message: "Failed to fetch calendar events" });
  }
});

router.put("/update-event", async (req, res) => {
  const user = req.user as any;

  if (!user || !user.accessToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id, summary, start, end } = req.body;

  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: user.accessToken,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const updated = await calendar.events.patch({
      calendarId: "primary",
      eventId: id,
      requestBody: {
        summary,
        start,
        end,
      },
    });

    res.json(updated.data);
  } catch (error) {
    console.error("Failed to update calendar event:", error);
    res.status(500).json({ error: "Failed to update event" });
  }
});

router.post("/event", async (req: Request, res: Response) => {
  const user = req.user as any;

  if (!user || !user.accessToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const {
    title,
    description,
    location,
    start,
    end,
    attendees,
    reminders,
    visibility,
  } = req.body;

  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: user.accessToken,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: title,
        description,
        location,
        start: { dateTime: new Date(start).toISOString() },
        end: { dateTime: new Date(end).toISOString() },
        attendees: attendees?.map((email: string) => ({ email })),
        reminders: reminders || {
          useDefault: true,
        },
        visibility: visibility || "default",
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
});

router.delete("/event/:eventId", async (req: Request, res: Response) => {
  const user = req.user as any;

  if (!user || !user.accessToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { eventId } = req.params;

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: user.accessToken,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    await calendar.events.delete({
      calendarId: "primary",
      eventId,
    });

    res.json({ message: "Event deleted successfully." });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Failed to delete event." });
  }
});

export default router;
