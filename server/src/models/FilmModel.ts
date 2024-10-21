import { Schema, model, Document } from "mongoose";

export interface IFilm extends Document {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: Date;
  characters: string[];
  planets: string[];
  starships: string[];
  vehicles: string[];
  species: string[];
  created: Date;
  edited: Date;
  url: string;
}

const filmSchema = new Schema<IFilm>({
  title: { type: String, required: true },
  episode_id: { type: Number, required: true },
  opening_crawl: { type: String, required: true },
  director: { type: String, required: true },
  producer: { type: String, required: true },
  release_date: { type: Date, required: true },
  characters: [{ type: String, required: true }],
  planets: [{ type: String, required: true }],
  starships: [{ type: String, required: true }],
  vehicles: [{ type: String, required: true }],
  species: [{ type: String, required: true }],
  created: { type: Date, required: true },
  edited: { type: Date, required: true },
  url: { type: String, required: true },
});

const FilmModel = model<IFilm>("Film", filmSchema);

export default FilmModel;
