using System.Security.Claims;
using LibraryApi.Data;
using LibraryApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryApi.Controllers;

/// <summary>
/// RESTful API controller for Book CRUD operations
/// Uses async/await for non-blocking I/O and proper HTTP status codes
/// </summary>

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly LibraryContext _context;

    public BooksController(LibraryContext context)
    {
        _context = context;
    }

    /// <summary>
    /// GET /api/books - Public: Returns all books (shared library catalog)
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<Book>>> GetBooks()
    {
        return await _context.Books.OrderBy(b => b.Title).ToListAsync();
    }

    /// <summary>
    /// GET /api/books/{id} - Public: Returns single book by ID
    /// </summary>
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<Book>> GetBook(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null) return NotFound();
        return book;
    }

    /// <summary>
    /// POST /api/books/create - Requires login: Creates new book
    /// </summary>
    [Authorize]
    [HttpPost("create")]
    public async Task<ActionResult<Book>> CreateBook(Book book)
    {
        if(!ModelState.IsValid) return BadRequest(ModelState);
        // var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
        // book.CreatedBy = userEmail ?? "System";
        _context.Books.Add(book);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetBook), new {id = book.Id}, book);
    }

    /// <summary>
    /// PUT /api/books/update/{id} - Requires login: Updates existing book
    /// </summary>
    [Authorize]
    [HttpPut("update/{id}")]
    public async Task<IActionResult> UpdateBook(int id, Book book)
    {
        if (id != book.Id) return BadRequest();
        _context.Entry(book).State = EntityState.Modified;
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!BookExists(id)) return NotFound();
            throw;
        }
        return NoContent();
    }

    private bool BookExists(int id)
    {
        return _context.Books.Any(e => e.Id == id);
    }

    /// <summary>
    /// DELETE /api/books/delete/{id} - Requires login: Deletes book
    /// </summary>
    [Authorize]
    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null) return NotFound();
        _context.Books.Remove(book);
        await _context.SaveChangesAsync();
        return NoContent();
    }

}