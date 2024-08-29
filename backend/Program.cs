using backend;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using shared.models.Identity;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors();

builder.Services.AddControllers();

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthentication().AddBearerToken(IdentityConstants.BearerScheme);
builder.Services.AddAuthorizationBuilder();

var config = builder.Configuration;
builder.Services.AddDbContext<MuseContext>(options =>
    options.UseNpgsql(config.GetConnectionString("DefaultConnection")));


builder.Services.AddSingleton<IConfiguration>(config);

builder.Services.AddIdentityCore<User>()
    .AddEntityFrameworkStores<MuseContext>()
    .AddApiEndpoints();


builder.Services.Configure<IdentityOptions>(options =>
{
    // Default Password settings.
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 8;
    options.Password.RequiredUniqueChars = 1;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseCors(options => options.AllowAnyMethod().AllowAnyHeader().WithOrigins(new []{"http://localhost:4201"}).AllowCredentials());

app.UseHttpsRedirection();

app.UseAuthentication();

app.MapIdentityApi<User>();
app.MapControllers();

app.UseAuthorization();

app.Run();