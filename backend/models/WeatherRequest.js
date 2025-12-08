import mongoose from "mongoose";

const temperatureSchema = new mongoose.Schema(
    {
  date: 
  { 
    type: Date, 
    required: true
 },

  temp:
   { 
    type: Number,
    required: true 
},

 description: 
 { 
  type: String
},

  humidity: { 
    type: Number, 
    required: false 
  },

  windSpeed: { 
    type: Number, 
    required: false 
  },
});


const weatherRequestSchema = new mongoose.Schema(
  {
    locationInput: 
    { 
      type: String, 
      required: true
     }, 
    normalizedLocation: String,
    lat: Number,
    lon: Number,
    
    startDate: 
    { 
      type: Date,
       required: true 
      },
    endDate: 
    { type: Date,
       required: true
     },
    temperatures: [temperatureSchema],
    mapsUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model("WeatherRequest", weatherRequestSchema);
