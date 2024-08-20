import { Note } from "./types";

export function findAll(): Note[] {
    const savedNotesString = localStorage.getItem("notes");
    return savedNotesString ? JSON.parse(savedNotesString) : [];
}

export function save(note : Note) {
  const notes = findAll();
  localStorage.setItem('notes', JSON.stringify([...notes, note]));
}