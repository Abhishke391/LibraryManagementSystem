using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LibraryApi.Data;
using LibraryApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace LibraryApi.Controllers;

/// <summary>
/// Handles user registration and login
/// POST /api/auth/register - Creates new user with BCrypt hashed password
/// POST /api/auth/login - Validates credentials and returns JWT token (valid 7 days)
/// JWT contains user Id and Email claims
/// Passwords are never stored in plain text
/// </summary>

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly LibraryContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(LibraryContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    /// <summary>
    /// Record types for register request, expects email and password
    /// </summary>
    public record RegisterRequest(string Email, string Password);

    /// <summary>
    /// Record types for login request, expects email and password
    /// </summary>
    public record LoginRequest(string Email, string Password);

    /// <summary>
    /// Record type for authentication response, contains JWT token and user email
    /// </summary>
    public record AuthResponse(string Token, string Email);


    /// <summary>
    /// POST /api/auth/register - Creates new user with BCrypt hashed password
    /// </summary>
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        if (_context.Users.Any(u => u.Email == request.Email)) 
        {
            return BadRequest("User already exists.");
        }
        var user = new AppUser
        {
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        var token = GenerateToken(user);
        return Ok(new AuthResponse(token, user.Email));
    }

    /// <summary>
    /// POST /api/auth/login - Validates credentials and returns JWT token
    /// </summary>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null)
        {
            return NotFound("User not found.");
        }

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return Unauthorized("Invalid credentials.");
        }
        var token = GenerateToken(user);
        return Ok(new AuthResponse(token, user.Email));
    }

    private string GenerateToken(AppUser user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            _configuration["Jwt:Key"]!
        ));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(2),
            signingCredentials: creds
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    

}