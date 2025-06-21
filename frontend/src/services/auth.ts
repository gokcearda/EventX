// Passkey authentication service
// This is a simplified implementation - in production, you'd use a proper WebAuthn library

export interface PasskeyCredential {
  id: string;
  rawId: ArrayBuffer;
  response: AuthenticatorAttestationResponse | AuthenticatorAssertionResponse;
  type: 'public-key';
}

class AuthService {
  private isPasskeySupported(): boolean {
    return !!(navigator.credentials && window.PublicKeyCredential);
  }

  async registerWithPasskey(username: string): Promise<PasskeyCredential> {
    if (!this.isPasskeySupported()) {
      throw new Error('Passkeys are not supported in this browser');
    }

    // Mock passkey registration
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, this would call navigator.credentials.create()
    return {
      id: 'mock-credential-id-' + Date.now(),
      rawId: new ArrayBuffer(32),
      response: {} as AuthenticatorAttestationResponse,
      type: 'public-key'
    };
  }

  async authenticateWithPasskey(): Promise<PasskeyCredential> {
    if (!this.isPasskeySupported()) {
      throw new Error('Passkeys are not supported in this browser');
    }

    // Mock passkey authentication
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real implementation, this would call navigator.credentials.get()
    return {
      id: 'mock-credential-id-existing',
      rawId: new ArrayBuffer(32),
      response: {} as AuthenticatorAssertionResponse,
      type: 'public-key'
    };
  }

  async isPasskeyAvailable(): Promise<boolean> {
    if (!this.isPasskeySupported()) {
      return false;
    }

    try {
      // Check if conditional UI is available
      const available = await PublicKeyCredential.isConditionalMediationAvailable();
      return available;
    } catch {
      return false;
    }
  }
}

export const authService = new AuthService();