export type Schedule = {
  _id: string;
  flightNumber: string;
  aircraft: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  capacity: number;
  price: number;
  bookings: unknown[];
};

export type Invoice = {
  bookingRef: string;
  passengerName: string;
  email: string;
  phone: string;
  status?: string;
  bookedAt?: string;
  flightNumber: string;
  aircraft: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
};

export type PassengerBooking = {
  bookingRef: string;
  passengerName: string;
  email: string;
  phone: string;
  status: string;
  bookedAt: string;
  flightNumber: string;
  aircraft: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
};
