export interface Event {
    id: string;
    summary: string;
    created: string;
    updated: string;
    start: EventDate;
    end: EventDate;
    organizer: {
        email: string;
        displayName: string;
        self: boolean;
    };
    conferenceData: {
        entryPoints: [{
            entryPointType: string;
            uri: string;
            label: string;
        }]
    };
}

interface EventDate {
    date: string;
    dateTime: string;
    timeZone: string;
}