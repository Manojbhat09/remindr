# Google Keep Integration Setup Guide

This guide will help you set up Google Keep integration for importing goals into your Remindr productivity app.

## Prerequisites

1. A Google account
2. Access to Google Cloud Console
3. Basic understanding of API setup

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter a project name (e.g., "Remindr Keep Integration")
4. Click "Create"

## Step 2: Enable Google Keep API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google Keep API"
3. Click on "Google Keep API" and click "Enable"

## Step 3: Create API Credentials

### Create OAuth 2.0 Client ID

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Select "Web application" as application type
4. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
5. Click "Create"
6. Copy the **Client ID**

### Create API Key

1. In the same credentials page, click "Create Credentials" → "API key"
2. Copy the **API Key**
3. (Optional) Restrict the API key to Google Keep API only

## Step 4: Configure Environment Variables

1. Create a `.env` file in your project root
2. Add the following variables:

```bash
REACT_APP_GOOGLE_CLIENT_ID=your_client_id_here
REACT_APP_GOOGLE_API_KEY=your_api_key_here
```

3. Replace `your_client_id_here` and `your_api_key_here` with your actual credentials

## Step 5: Test the Integration

1. Start your development server: `npm start`
2. Navigate to the Goals Dashboard
3. Click "Import from Keep" button
4. Authenticate with your Google account
5. Import your Google Keep notes as goals

## Security Notes

- Never commit your `.env` file to version control
- Keep your API credentials secure
- Consider restricting API key usage to specific domains/IPs
- Monitor API usage in Google Cloud Console

## Troubleshooting

### Common Issues

1. **"Authentication failed" error**
   - Check your Client ID and API Key
   - Ensure Google Keep API is enabled
   - Verify authorized origins include your domain

2. **"Failed to import goals" error**
   - Check browser console for detailed errors
   - Verify you have Google Keep notes with titles
   - Ensure you're signed into the correct Google account

3. **API quota exceeded**
   - Check your Google Cloud Console quotas
   - Consider upgrading your plan if needed

### Support

If you continue to have issues:
1. Check the browser console for error messages
2. Verify all setup steps were completed correctly
3. Ensure your Google account has access to Google Keep

## Features

The Google Keep integration provides:

- **Secure OAuth 2.0 authentication**
- **Automatic note-to-goal conversion**
- **SMART criteria generation**
- **Batch import functionality**
- **Error handling and user feedback**

## API Usage

The integration uses the following Google APIs:
- **Google Keep API v1**: For reading notes and lists
- **Google OAuth 2.0**: For secure authentication
- **Google Identity Services**: For user management

## Rate Limits

- Google Keep API: 1000 requests per 100 seconds per user
- OAuth 2.0: No specific limits
- Monitor usage in Google Cloud Console

---

**Note**: This integration is for demo purposes. In production, consider implementing proper error handling, rate limiting, and user feedback mechanisms. 