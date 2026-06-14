export class GoogleSheetsService {
  static async sendProfileData(profileData) {
    const webhookUrl = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL;

    if (!webhookUrl) {
      console.warn('Google Sheets webhook URL not configured');
      return false;
    }

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({
          action: 'updateProfile',
          data: profileData,
          timestamp: new Date().toISOString()
        })
      });

      return true;
    } catch (error) {
      console.error('Failed to send data to Google Sheets:', error);
      return false;
    }
  }
}
