
namespace LibraryApi.Models;

/// <summary>
/// Represents a book in the library
/// Title and Author are required fields
/// Description is optional
/// CreatedAt automatically records when the book was added
/// Mapped to SQLite table via Entity Framework Core
/// </summary>
public class Book
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Author { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    // public string CreatedBy {get; set;} = "Unknown";

}