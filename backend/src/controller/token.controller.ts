import {Service} from "typedi";
import { createSigner } from 'fast-jwt';

@Service()
export class TokenService {
  private privateKey: string;

  constructor(privateKey: string) {
    this.privateKey = privateKey;
  }

  createJwt(payload: any) {
    const sign = createSigner({
      key: this.privateKey,
      algorithm: 'RS256' // Use the appropriate algorithm for your key
    });

    return sign(payload);
  }
}
