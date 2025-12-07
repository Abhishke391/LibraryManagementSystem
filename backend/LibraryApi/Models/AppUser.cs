namespace LibraryApi.Models;

/// <summary>
/// Represents a registered user
/// Email must be unique
/// Password is stored as BCrypt hash for security
/// </summary>

public class AppUser
{
    public int Id { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
}