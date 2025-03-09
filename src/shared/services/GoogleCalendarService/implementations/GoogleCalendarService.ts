import { google, calendar_v3, Auth } from "googleapis";

import { IGoogleCalendarService } from "../IGoogleCalendarService";

import { ListEventsByDateRangeDTO } from "../DTOs/ListEventsByDateRangeDTO";
import { Event } from "../models/Event";

export class GoogleCalendarService implements IGoogleCalendarService {
    private readonly oAuth2Client: Auth.OAuth2Client;
    private readonly calendar: calendar_v3.Calendar;

    constructor() {
        this.oAuth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );

        this.calendar = google.calendar({ version: "v3", auth: this.oAuth2Client })
    }

    async listEventsByDateRange(dto: ListEventsByDateRangeDTO): Promise<Event[]> {
        try {
            this.oAuth2Client.setCredentials({
                refresh_token: dto.refresh_token
            });

            const events = await this.calendar.events.list({
                calendarId: "primary",
                timeMin: dto.start_date,
                timeMax: dto.end_date,
                maxResults: 10,
                singleEvents: true,
                orderBy: "startTime",
                fields: "items(id,summary,created,updated,start,end,organizer,conferenceData)",
            });

            return events.data?.items?.filter(event => event.conferenceData?.entryPoints && event.conferenceData?.entryPoints?.length > 0)
            .map((event: calendar_v3.Schema$Event) => {
                return {
                    id: event.id,
                    summary: event.summary,
                    created: event.created,
                    updated: event.updated,
                    start: event.start,
                    end: event.end,
                    organizer: event.organizer,
                    conferenceData: event.conferenceData || null,
                } as Event;
            }) ?? [];
        }  catch(error) {
            console.log(error);
            throw new Error('Error listing events by date range');
        }
    }
}