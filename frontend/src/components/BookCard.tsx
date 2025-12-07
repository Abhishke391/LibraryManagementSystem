import type { Book } from "../types";

interface Props {
    book: Book;
    onEdit: () => void;
    onDelete: () => void;
}

export default function BookCard({book, onEdit, onDelete}: Props) {
    return (
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
        <h3 className="text-xl font-bold">{book.title}</h3>
        <p className="text-gray-600">by {book.author}</p>
        {book.description && <p className="mt-2 text-gray-700">{book.description}</p>}
        <div className="mt-4 flex gap-3">
        <button onClick={onEdit} className="text-blue-600 hover:underline">Edit</button>
        <button onClick={onDelete} className="text-red-600 hover:underline">Delete</button>
      </div>
    </div>
    )
}