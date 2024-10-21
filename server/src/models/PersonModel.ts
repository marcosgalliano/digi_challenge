import mongoose, { Schema, Document } from "mongoose";

interface IPerson extends Document {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
}

const PersonSchema: Schema = new Schema({
  name: { type: String, required: true },
  height: { type: String, required: true },
  mass: { type: String, required: true },
  hair_color: { type: String, required: true },
  skin_color: { type: String, required: true },
  eye_color: { type: String, required: true },
  birth_year: { type: String, required: true },
  gender: { type: String, required: true },
  homeworld: { type: String, required: true },
  films: [{ type: String }],
});

export default mongoose.model<IPerson>("Person", PersonSchema);
