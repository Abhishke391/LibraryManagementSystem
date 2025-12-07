using LibraryApi.Models;
using Microsoft.EntityFrameworkCore;
namespace LibraryApi.Data;

/// <summary>
/// Entity Framework Core DbContext
/// Defines DbSet for Books and Users
/// Automatically creates SQLite database file (library.db) on first run
/// </summary>

public class LibraryContext : DbContext
{
    public LibraryContext(DbContextOptions<LibraryContext> options) : base(options) {}
    public DbSet<Book> Books => Set<Book>();
    public DbSet<AppUser> Users => Set<AppUser>();
}