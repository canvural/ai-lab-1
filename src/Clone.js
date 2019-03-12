export default function Clone(obj) {
	if (obj == null || typeof obj !== 'object') return obj;

	return JSON.parse(JSON.stringify(obj));
}
