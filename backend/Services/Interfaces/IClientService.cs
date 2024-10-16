﻿using System.Net.WebSockets;

namespace backend.Services.Interfaces;

public interface IClientService
{
    Task HandleWebSocketConnection(WebSocket socket);
}