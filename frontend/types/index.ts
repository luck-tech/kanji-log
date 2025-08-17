export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  purpose: EventPurpose;
  description?: string;
  status: EventStatus;
  date?: string;
  time?: string;
  venue?: Venue;
  organizerId: string;
  members: EventMember[];
  dateOptions?: DateOption[];
  restaurantSuggestions?: Restaurant[];
  eventLog?: EventLog;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  responseStatus: ResponseStatus;
  dateResponses: DateResponse[];
  joinedAt: string;
}

export interface DateOption {
  id: string;
  date: string;
  time?: string;
  responses: DateResponse[];
}

export interface DateResponse {
  userId: string;
  response: 'available' | 'maybe' | 'unavailable';
}

export interface Restaurant {
  id: string;
  name: string;
  genre: string;
  area: string;
  phone: string;
  address: string;
  rating?: number;
  priceRange: string;
  imageUrl?: string;
  recommendationReason?: string;
  mapUrl?: string;
}

export interface Venue {
  name: string;
  address: string;
  phone?: string;
  mapUrl?: string;
  genre?: string;
  area?: string;
}

export interface EventLog {
  id: string;
  eventId: string;
  organizerId: string;
  rating: number;
  notes: string;
  totalCost: number;
  costPerPerson: number;
  attendees?: number;
  venue: Venue;
  isShared: boolean;
  createdAt: string;
}

export type EventStatus = 'planning' | 'confirmed' | 'completed';
export type ResponseStatus = 'pending' | 'accepted' | 'declined' | 'maybe';
export type EventPurpose = 'welcome' | 'farewell' | 'celebration' | 'team_building' | 'casual' | 'other';

export interface SharedRecord {
  id: string;
  eventLog: EventLog;
  event: {
    title: string;
    purpose: EventPurpose;
  };
  organizer: {
    name: string;
    avatar?: string;
  };
}