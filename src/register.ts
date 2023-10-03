import { client } from "@passwordless-id/webauthn";
import axios from "axios";

export async function registerUser(username: string): Promise<void> {
  try {
    const challengeResponse = await axios.post(
      "https://uim-alpha.meroku.org/request-challenge",
      { username }
    );
    const challenge = challengeResponse.data.challenge;

    const registration = await client.register(username, challenge, {
      authenticatorType: "auto",
      userVerification: "required",
      timeout: 60000,
      attestation: false,
      debug: false,
    });

    await axios.post("https://uim-alpha.meroku.org/register", registration);
  } catch (error: any) {
    throw new Error("Registration failed: " + error.message);
  }
}
