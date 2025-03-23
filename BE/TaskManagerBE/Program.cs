using Microsoft.EntityFrameworkCore;
using TaskManagerBE.Data;
using Microsoft.OpenApi.Models;
using DotNetEnv;

var builder = WebApplication.CreateBuilder(args);

// Load .env file
Env.Load();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "TaskManager API", Version = "v1" });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySQL(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

app.Run();
