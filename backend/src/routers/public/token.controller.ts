import {Controller, Path, Post, Request, Response, Route, SuccessResponse, Tags,} from "tsoa";
import Container from "typedi";
import {TokenService} from "../../controller/token.controller";
import {ResponseError} from "../../utils/tsoa-response-error";
import {readFileSync} from 'node:fs';
import {v4 as uuidv4} from 'uuid';
import ms from 'ms';

require('dotenv').config();

interface Token {
  id: number;
  md: number;
  mu: number;
  exp: Date;
  idc: string;
  idr: number;
  createdAt: Date;
  updatedAt: Date | null;
}

@Route("/tokens")
@Tags("Public")
export class TokenController extends Controller {
  tokenService!: TokenService;

  constructor() {
    super();
    this.tokenService = Container.get(TokenService);
  }

  /**
   * Create a new token.
   * @returns The newly created token code.
   * @summary Create token code
   */
  @Post("{licenseCode}")
  @SuccessResponse(201, "Created")
  @Response<ResponseError<"token-with-same-code-already-exists">>(
    "400",
    "Token with same code already exists"
  )
  @Response<ResponseError<"invalid-schema">>(422, "Invalid schema")
  public async create(
    @Request() request: Express.Request,
    @Path() licenseCode: string,
  ): Promise<string> {
    const privateKeyPath = process.env.PRIVATE_KEY

    if (!privateKeyPath) {
      throw new Error("Private key path is missing");
    }

    // Read private key
    const privateKey = readFileSync(privateKeyPath, 'utf-8');

    // Parse payload
    const payload = JSON.parse(
      `
      {
        "idc": "${licenseCode}"
      }
      `
    );

    if (!payload.idc) {
      console.warn("No 'idc' (license uuid) supplied in license, generating one");
      payload.idc = uuidv4();
    }

    if (!payload.exp) {
      console.warn("No 'exp' (expiryDate) supplied in license, generating one [+ 1yr]");
      payload.exp = Math.trunc((Date.now() + ms('1 year')) / 1000);
    }

    if (!payload.idr) {
      const now = Math.trunc(Date.now() / 1000);
      console.warn(`No 'idr' (license revision) supplied in license, generating one [${now}]`);
      payload.idr = now;
    }

    if (!payload.mu) {
      console.warn(`No 'mu' (max users) supplied in license, generating one [10]`);
      payload.mu = 10;
    }

    if (!payload.md) {
      console.warn(`No 'md' (max devices) supplied in license, generating one [10]`);
      payload.mu = 10;
    }

    return new TokenService(privateKey).createJwt(payload);
  }
}
