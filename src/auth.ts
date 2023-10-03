import axios from "axios";
import { client } from "@passwordless-id/webauthn";

export async function authenticateUser(username: string): Promise<string> {
  try {
    const challengeResponse = await axios.post(
      "https://uim-alpha.meroku.org/request-challenge",
      { username }
    );
    const challenge = challengeResponse.data.challenge;

    const credentialsResponse = await axios.get(
      `https://uim-alpha.meroku.org/credentials/${username}`
    );
    const credentials = credentialsResponse.data.credentialIds;

    const authentication = await client.authenticate(credentials, challenge, {
      authenticatorType: "auto",
      userVerification: "required",
      timeout: 60000,
    });

    await axios.post("https://uim-alpha.meroku.org/authenticate", {
      challenge,
      authentication,
    });

    const response = await axios.get(
      `https://uim-alpha.meroku.org/credentials/${username}`
    );
    if (response.data && response.data.walletAddress) {
      return response.data.walletAddress;
    } else {
      throw new Error("Wallet address not found");
    }
  } catch (error: any) {
    throw new Error("Authentication failed: " + error.message);
  }
}
