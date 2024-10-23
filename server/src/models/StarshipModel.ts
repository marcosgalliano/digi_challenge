import { Schema, model, Document } from "mongoose";

export interface IStarship extends Document {
  apiId: number;
  name: string;
  starshipModel: string;
  manufacturer: string;
  cost_in_credits: number;
  length: string;
  max_atmosphering_speed: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  consumables: string;
  hyperdrive_rating: string;
  MGLT: string;
  starship_class: string;
  pilots: string[];
  films: string[];
}

const starshipSchema = new Schema<IStarship>({
  apiId: { type: Number, required: true },
  name: { type: String, required: true },
  starshipModel: { type: String, required: true },
  manufacturer: { type: String, required: true },
  cost_in_credits: { type: Number },
  length: { type: String, required: true },
  max_atmosphering_speed: { type: String, required: true },
  crew: { type: String, required: true },
  passengers: { type: String, required: true },
  cargo_capacity: { type: String, required: true },
  consumables: { type: String, required: true },
  hyperdrive_rating: { type: String, required: true },
  MGLT: { type: String, required: true },
  starship_class: { type: String, required: true },
  pilots: [{ type: String }],
  films: [{ type: String }],
});

const StarshipModel = model<IStarship>("Starship", starshipSchema);

export default StarshipModel;
