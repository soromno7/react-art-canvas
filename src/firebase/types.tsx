import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";

export interface IFirebaseContextType {
  auth: Auth,
  firestore: Firestore;
}

export interface ISavedImage {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: number;
  storagePath: string;
}