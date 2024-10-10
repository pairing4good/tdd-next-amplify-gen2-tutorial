
const isValidNote = (note: { name: string; description: string;}) => {
    return !!note.name && !!note.description;
};

export default isValidNote;