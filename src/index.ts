/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler deploy src/index.ts --name my-worker` to deploy your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import domainMatches from './utility';

export default {

	async fetch(request: Request, env: Record<string, string>): Promise<Response> {
		const geo = request.cf || {};
		const allowedOriginsString = env.ALLOWED_ORIGINS || "*";
		const headers = new Headers();

		headers.set("X-Geo-Country", geo.country as string || "Unknown");
		headers.set("X-Geo-City", geo.city as string || "Unknown");
		headers.set("X-Geo-Region", geo.region as string || "Unknown");
		headers.set("X-Geo-Timezone", geo.timezone as string || "Unknown");

		let origin = request.headers.get("origin");

		if (allowedOriginsString === "*") {
			headers.set("Access-Control-Allow-Origin", "*");
		} else {
			const allowedOrigins = allowedOriginsString.split(",").map((o) => o.trim());
			if (domainMatches(origin as string, allowedOrigins)) {
				headers.set("Access-Control-Allow-Origin", origin as string);
			} else {
				return new Response(null, { status: 302 });
			}
		}

		headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
		headers.set("Access-Control-Allow-Headers", "Content-Type");

		const geoInfo = {
			country: geo.country || "Unknown",
			city: geo.city || "Unknown",
			region: geo.region || "Unknown",
			timezone: geo.timezone || "Unknown",
		};

		if (request.method === "OPTIONS") {
			return new Response(null, { status: 204, headers });
		}

		headers.set("Content-Type", "application/json");
		return new Response(JSON.stringify(geoInfo), { status: 200, headers });
	},
};
