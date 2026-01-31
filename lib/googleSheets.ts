import { google } from 'googleapis';
import type { FormData } from '@/components/CalculatorForm';
import type { TaxCalculationResult } from '@/lib/taxCalculations';
import { formatCOP } from '@/lib/taxCalculations';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

/**
 * Get authenticated Google Sheets client using service account credentials
 */
async function getAuthClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKeyBase64 = process.env.GOOGLE_PRIVATE_KEY_BASE64;

  if (!email || !privateKeyBase64) {
    throw new Error('Google Sheets credentials not configured');
  }

  // Decode base64-encoded private key to handle newlines properly
  const privateKey = Buffer.from(privateKeyBase64, 'base64').toString('utf-8');

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: email,
      private_key: privateKey,
    },
    scopes: SCOPES,
  });

  return auth;
}

/**
 * Append calculation data to Google Sheet
 * Fire-and-forget: logs errors but doesn't throw
 */
export async function appendCalculation(
  formData: FormData,
  result: TaxCalculationResult
): Promise<void> {
  try {
    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!sheetId) {
      console.warn('Google Sheet ID not configured, skipping data append');
      return;
    }

    const auth = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    // Prepare row data
    const timestamp = new Date().toISOString();
    const row = [
      timestamp,
      formData.nombre,
      formData.email,
      formData.cedulaNit,
      formData.celular,
      formData.ciudad,
      formData.tipoCliente,
      formData.ingresosMensuales,
      formData.otrasDeducciones,
      formData.valorVehiculo,
      result.annualSavings,
      result.bracketWithoutVehicle.bracketName,
      result.bracketWithVehicle.bracketName,
    ];

    // Get the first sheet name dynamically
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
      fields: 'sheets.properties.title',
    });

    const firstSheetName = spreadsheet.data.sheets?.[0]?.properties?.title || 'Sheet1';

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `'${firstSheetName}'!A:M`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    });

    console.log('Successfully appended calculation to Google Sheets');
  } catch (error) {
    // Log error but don't throw - this is fire-and-forget
    console.error('Failed to append to Google Sheets:', error);
  }
}
