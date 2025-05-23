# MCP Host UI Client

This Angular-based UI client connects to the MCP Host service, providing a user-friendly interface for accessing language models with Model Context Protocol (MCP) capabilities.

## Features

- **User Authentication**: Secure login with JWT-based authentication
- **Conversation Management**: Create, view, and delete conversations
- **Message Exchange**: Send and receive messages with AI assistants
- **Theme Customization**: Toggle between light and dark themes
- **Settings Management**: Configure API endpoints and preferences
- **Responsive Design**: Works on mobile and desktop devices

## Development Setup

### Prerequisites

- Node.js (v18 or newer)
- npm (v9 or newer)
- Angular CLI (v19 or newer)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/mcp-host-ui.git
cd mcp-host-ui
```

2. Install dependencies:

```bash
npm install
```

### Configuration

Configure the API endpoint in the environment file:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: "http://localhost:8000",
};
```

### Development Server

To start a local development server, run:

```bash
ng serve
```

Navigate to `http://localhost:4200/` in your browser. The application will automatically reload when you change any source files.

## Building for Production

To build the project for production deployment:

```bash
ng build --configuration production
```

This will generate optimized files in the `dist/` directory.

## MCP Host Integration

This UI client is designed to work with an MCP Host service, which should be running separately. The UI communicates with the MCP Host via REST API endpoints as specified in the UI-Client-Requirements.md document.

### Supported API Endpoints

- Authentication: `/api/auth/token`
- Conversations: `/conversations`
- Messages: `/conversations/{id}/messages`
- Health Check: `/health`

## Testing

Run unit tests with:

```bash
ng test
```

ng e2e

```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
```
