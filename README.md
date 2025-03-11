# Cloudflare Worker: Geo Location Information

This repository contains a Cloudflare Worker that returns geolocation information based on the incoming request. It also handles Cross-Origin Resource Sharing (CORS) based on a configured list of allowed origins.

## Overview

The worker intercepts requests, extracts geolocation data from Cloudflare's `request.cf` object, and returns it as a JSON response. It also sets CORS headers to allow requests from specified origins.

## Files

-   `src/index.ts`: The main worker script.
-   `src/utility.ts`: Utility function for domain matching.
-   `wrangler.toml`: Cloudflare Wrangler configuration file.

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Client
    participant Cloudflare Edge
    participant Worker
    participant Origin Server (if applicable)

    Client->>Cloudflare Edge: Request (e.g., GET /geo)
    Cloudflare Edge->>Worker: Execute Worker
    Worker->>Worker: Extract geolocation from request.cf
    Worker->>Worker: Check allowed origins
    alt Origin Allowed
        Worker->>Cloudflare Edge: Set CORS headers (Access-Control-Allow-Origin)
        alt OPTIONS Request
            Worker->>Cloudflare Edge: Respond with 204 (No Content)
        else GET Request
            Worker->>Worker: Create Geo JSON response
            Worker->>Cloudflare Edge: Respond with 200 (OK) and Geo JSON
        end
    else Origin Not Allowed
        Worker->>Cloudflare Edge: Respond with 302 (Found)
    end
    Cloudflare Edge->>Client: Response
