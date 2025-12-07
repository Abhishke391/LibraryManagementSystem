import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../services/AxiosInstance';
import BookCard from '../components/BookCard';
import BookForm from '../components/BookForm';
import type { Book } from '../types';
import bookImg from '../assets/book.jpg';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Home() {
  const { user, logout } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>();

  const { data: books = [], isLoading } = useQuery<Book[]>({
    queryKey: ['books'],
    queryFn: () => axiosInstance.get('/books').then(res => res.data),
  });

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id: number) => axiosInstance.delete(`/books/delete/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success('Book deleted');
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="text-center max-w-2xl">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">Library Management System</h1>
          <p className="text-xl text-gray-700 mb-10">Manage your book collection with ease</p>
          <Link to="/login" className="inline-block px-10 py-5 text-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition">
            Get Started
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Modern Navbar */}
      <nav className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                My Library
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-lg font-medium text-gray-700">Welcome, {user}</span>
              <button
                onClick={logout}
                className="text-red-600 hover:text-red-700 font-medium transition"
              >
                Logout
              </button>
              <button
                onClick={() => {
                  setEditingBook(undefined);
                  setShowForm(true);
                }}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition"
              >
                + Add Book
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-600 mb-8">Your library is empty</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-medium hover:bg-blue-700 transition"
              >
                Add Your First Book
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                >
                  <div
                    className="h-54 bg-cover bg-center"
                    style={{ backgroundImage: `url(${bookImg})` }}
                  ></div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{book.title}</h3>
                    <p className="text-gray-600 font-medium mb-3">by {book.author}</p>
                    {book.description && (
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">{book.description}</p>
                    )}
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => {
                          setEditingBook(book);
                          setShowForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(book.id)}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <BookForm
          book={editingBook}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
            setShowForm(false);
          }}
          onClose={() => setShowForm(false)}
        />
      )}
    </>
  );
}