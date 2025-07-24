export const PAYFAST_CONFIG = {
  merchantId: process.env.PAYFAST_MERCHANT_ID || '27309011',
  merchantKey: process.env.PAYFAST_MERCHANT_KEY || 'v5zma443niq7w',
  securityPhrase: process.env.PAYFAST_SECURITY_PHRASE || 'Paparazzi12345',
  returnUrl: process.env.PAYFAST_RETURN_URL || 'papz://payment/success',
  cancelUrl: process.env.PAYFAST_CANCEL_URL || 'papz://payment/cancel',
  notifyUrl: process.env.PAYFAST_NOTIFY_URL || 'https://mwarikayompvdewfcvam.supabase.co/functions/v1/payfast-webhook',
  sandbox: true, // Set to false for production
  baseUrl: 'https://sandbox.payfast.co.za/eng/process'
};

export const generatePayFastSignature = (data: Record<string, any>): string => {
  const { securityPhrase } = PAYFAST_CONFIG;
  
  // Remove signature if present
  delete data.signature;
  
  // Create parameter string
  const paramString = Object.keys(data)
    .sort()
    .map(key => `${key}=${encodeURIComponent(data[key])}`)
    .join('&');
  
  // Add security phrase if provided
  const stringToHash = securityPhrase ? `${paramString}&passphrase=${encodeURIComponent(securityPhrase)}` : paramString;
  
  // In a real app, you'd use crypto.createHash('md5').update(stringToHash).digest('hex')
  // For now, we'll return a placeholder
  return 'generated_signature_placeholder';
};