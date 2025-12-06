import { useState } from 'react';
import type { Book } from '../types';
import toast from 'react-hot-toast';
import axiosInstance from '../services/AxiosInstance';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  book?: Book;
  onSuccess: () => void;
  onClose: () => void;
}

export default function BookForm({ book, onClose }: Props) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(book?.title || '');
  const [author, setAuthor] = useState(book?.author || '');
  const [description, setDescription] = useState(book?.description || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (book) {
        await axiosInstance.put(`/books/update/${book.id}`, { id: book.id, title, author, description });
        toast.success('Book updated successfully!');
      } else {
        await axiosInstance.post('/books/create', { title, author, description });
        toast.success('Book added successfully!');
      }
      queryClient.invalidateQueries({ queryKey: ['books'] });
      onClose();
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop - now with blur and lighter */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-8 shadow-2xl transition-all">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          {book ? 'Edit Book' : 'Add New Book'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Book Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-300 px-5 py-4 text-lg focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
          />
          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-300 px-5 py-4 text-lg focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-gray-300 px-5 py-4 text-lg focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 resize-none"
          />

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 text-lg font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:indigo-700 shadow-lg transition transform hover:scale-105"
            >
              {book ? 'Update Book' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}