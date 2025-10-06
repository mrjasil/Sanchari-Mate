import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  interests: string;
  status: "upcoming" | "ongoing" | "completed";
  image?: string;
}

interface TripState {
  trips: Trip[];
}

const initialState: TripState = {
  trips: [],
};

const tripSlice = createSlice({
  name: "trip",
  initialState,
  reducers: {
    addTrip: (state, action: PayloadAction<Trip>) => {
      state.trips.push(action.payload);
    },
    removeTrip: (state, action: PayloadAction<string>) => {
      state.trips = state.trips.filter((trip) => trip.id !== action.payload);
    },
    updateTrip: (state, action: PayloadAction<Trip>) => {
      const index = state.trips.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.trips[index] = action.payload;
      }
    },
  },
});

export const { addTrip, removeTrip, updateTrip } = tripSlice.actions;
export default tripSlice.reducer;
