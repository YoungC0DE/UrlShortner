import { FastifyReply, FastifyRequest } from "fastify";
import { nanoid } from "nanoid";
import { getDb } from "../../configs/mongo";
import { StatusCodes as HttpCode } from "http-status-codes";

import {
  CreateShortUrlDTO,
  UrlDocument,
} from "../../types/url.types";
import {
  UrlValidationError,
  parseValidHttpUrl,
} from "../../utils/validate-http-url";
import { addMonths } from "../../utils/add-months";

function validationMessage(code: UrlValidationError["code"]): string {
  switch (code) {
    case "EMPTY":
      return "URL is required";
    case "INVALID_FORMAT":
      return "URL must be a valid absolute address (e.g. https://example.com)";
    case "UNSUPPORTED_PROTOCOL":
      return "Only http and https URLs are allowed";
    case "MISSING_HOST":
      return "URL must include a hostname";
    default:
      return "Invalid URL";
  }
}

/**
 * Creates a short URL for the given original URL.
 * @param request 
 * @param reply 
 * @returns 
 */
export async function createShortUrlController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { url } = request.body as CreateShortUrlDTO;

    const normalizedUrl = parseValidHttpUrl(url);

    const code = nanoid(6);
    const db = getDb();

    const created_at = new Date();

    const document: UrlDocument = {
      code,
      original_url: normalizedUrl,
      created_at,
      expires_at: addMonths(created_at, 6),
    };

    await db.collection("urls").insertOne(document);

    return reply.send({
      code,
      short_url: `${request.protocol}://${request.headers.host}/${code}`,
    });
  } catch (error) {
    if (error instanceof UrlValidationError) {
      return reply.status(HttpCode.BAD_REQUEST).send({
        error: validationMessage(error.code),
      });
    }

    throw error;
  }
}

/**
 * Redirects to the original URL based on the provided short code.
 * @param request 
 * @param reply 
 * @returns 
 */
export async function redirectController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { code } = request.params as {
    code: string;
  };

  const db = getDb();

  const now = new Date();

  const url = await db.collection<UrlDocument>("urls").findOneAndUpdate(
    {
      code,
      expires_at: { $gt: now },
    },
    {
      $set: {
        last_access_at: now,
        expires_at: addMonths(now, 6),
      },
    },
    { returnDocument: "after" }
  );

  if (!url) {
    return reply.status(HttpCode.NOT_FOUND).send({
      error: "Not found",
    });
  }

  return reply.redirect(url.original_url);
}