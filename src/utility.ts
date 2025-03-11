export default function domainMatches(domain: string, patterns: string[]): boolean {
	for (const pattern of patterns) {
		if (pattern.includes('*')) {
			const regexPattern = pattern.replace(/\./g, '\\.').replace(/\*/g, '.*');
			const regex = new RegExp(`^${regexPattern}$`);
			if (regex.test(domain)) {
				return true;
			}
		} else if (domain === pattern) {
			return true;
		}
	}
	return false;
}