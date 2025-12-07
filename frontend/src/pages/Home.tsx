import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../services/AxiosInstance';
import BookForm from '../components/BookForm';
import Hero from '../components/Hero';
import type { Book } from '../types';
import bookImg from '../assets/book.jpg';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Home() {
  const { user, logout } = useAuth();
  const isAuthenticated = Boolean(user);
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

  const requireAuth = (action: () => void) => {
    if (!isAuthenticated) {
      toast.error('Please login to add, edit, or delete books.');
      return;
    }
    action();
  };

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
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <span className="text-lg font-medium text-gray-700">Welcome, {user}</span>
                  <button
                    onClick={logout}
                    className="text-red-600 hover:text-red-700 font-medium transition"
                  >
                    Logout
                  </button>
                  <button
                    onClick={() => requireAuth(() => {
                      setEditingBook(undefined);
                      setShowForm(true);
                    })}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition"
                  >
                    + Add Book
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-5 py-2 font-semibold text-blue-700 border border-blue-200 rounded-xl hover:bg-blue-50 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2 font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow hover:shadow-md transition"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <Hero
        user={user}
        onAddClick={() => requireAuth(() => {
          setEditingBook(undefined);
          setShowForm(true);
        })}
      />

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
                onClick={() => requireAuth(() => setShowForm(true))}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-medium hover:bg-blue-700 transition"
              >
                {isAuthenticated ? 'Add Your First Book' : 'Login to add books'}
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
                    {isAuthenticated ? (
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => requireAuth(() => {
                            setEditingBook(book);
                            setShowForm(true);
                          })}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => requireAuth(() => deleteMutation.mutate(book.id))}
                          className="text-red-600 hover:text-red-700 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Login to edit or delete</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isAuthenticated && showForm && (
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