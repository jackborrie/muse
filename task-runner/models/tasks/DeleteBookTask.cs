using System.Text.Json;
using shared.models;
using shared.models.data;

namespace task_runner.models.tasks;

public class DeleteBookTask: Task
{
    
    private string BookId { get; set; }
    public DeleteBookTask(QueuedTask queuedTask) : base(queuedTask)
    {
    }

    public override bool LoadData(string data)
    {
        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
        };

        BookDeleteData? bookData;

        try
        {
            bookData = JsonSerializer.Deserialize<BookDeleteData>(data, options);
        }
        catch (Exception)
        {
            return false;
        }

        if (bookData == null || string.IsNullOrEmpty(bookData.BookId))
        {
            return false;
        }

        BookId = bookData.BookId;

        return true;
    }

    protected override bool Process()
    {
        var currentUser = DbContext?.Users.FirstOrDefault(u => u.Id == QueuedTask.UserId);

        if (currentUser == null)
        {
            QueuedTask.Message = "No user assigned to this task. Failing";
            QueuedTask.Attempts = 3;
            return false;
        }

        var book = DbContext?.Books.FirstOrDefault(b => b.Id == BookId);

        if (book == null)
        {
            QueuedTask.Message = "Book assigned to this task doesn't exist. Failing";
            QueuedTask.Attempts = 3;
            return false;
        }

        if (File.Exists(book.Path))
        {
            File.Delete(book.Path);
        }

        DbContext?.Books.Remove(book);
        try
        {
            DbContext?.SaveChanges();
        }
        catch (Exception e)
        {
            QueuedTask.Message = "Failed to delete book. Got error: " + e.Message;
            return false;
        }

        return true;
    }

    protected override void Revert()
    {
    }
}