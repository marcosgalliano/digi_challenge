import { Schema, model, Document } from "mongoose";

export interface IPlanet extends Document {
  apiId: number;
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: number;
  residents: string[];
  films: string[];
}

const planetSchema = new Schema<IPlanet>({
  apiId: { type: Number, required: true },
  name: { type: String, required: true },
  rotation_period: { type: String, required: true },
  orbital_period: { type: String, required: true },
  diameter: { type: String, required: true },
  climate: { type: String, required: true },
  gravity: { type: String, required: true },
  terrain: { type: String, required: true },
  surface_water: { type: String, required: true },
  population: { type: Number },
  residents: [{ type: String }],
  films: [{ type: String }],
});

const PlanetModel = model<IPlanet>("Planet", planetSchema);

export default PlanetModel;
