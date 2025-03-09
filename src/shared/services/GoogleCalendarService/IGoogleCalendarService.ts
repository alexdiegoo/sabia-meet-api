import { Event } from "./models/Event";
import { ListEventsByDateRangeDTO } from "./DTOs/ListEventsByDateRangeDTO";

export interface IGoogleCalendarService {
    listEventsByDateRange(dto: ListEventsByDateRangeDTO): Promise<Event[]>;
}