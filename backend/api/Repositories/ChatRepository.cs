using api.Interfaces;
using api.Models;
using api.Settings;
using MongoDB.Driver;

namespace api.Repositories;

public class ChatRepository : IChatRepository
{
    private readonly IMongoCollection<ChatMessage> _collection;

    public ChatRepository(IMongoClient client, IMyMongoDbSettings dbSettings)
    {
        var dbName = client.GetDatabase(dbSettings.DatabaseName);
        _collection = dbName.GetCollection<ChatMessage>("chats");
    }

    public async Task SavedMessageAsync(ChatMessage message)
    {
        await _collection.InsertOneAsync(message);
    }

    public async Task<List<ChatMessage>> GetMessageAsync()
    {
        return await _collection.Find(_ => true).ToListAsync();
    }

     public async Task<bool> DeletMassageAsync(string messageId)
    {
        var result = await _collection.DeleteOneAsync(x => x.Id == messageId);
        return result.DeletedCount > 0;
    }
}