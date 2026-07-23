// src/keyword-wrapper.js
import rake from 'rake-js';

// Normalize RAKE export: some builds export a function at `.rake` or as default.
window.RAKE = rake;

function rakeExtract(text) {
	try {
		// rake may export a function `rake` or be the function itself
		if (typeof window.RAKE === 'function') {
			// RAKE default export in bundle is `process(text, opts)`
			return window.RAKE(String(text), { language: 'english', delimiters: ['\\s+'] });
		}
		if (window.RAKE && typeof window.RAKE.rake === 'function') {
			return window.RAKE.rake({ corpus: String(text), language: 'english', delimiters: ['\\s+'] });
		}
	} catch (e) {
		console.warn('rakeExtract error', e);
	}
	return null;
}

function normalizeRakeOutput(results) {
	// rake-js may return array of [phrase, score] or objects; normalize to strings
	if (!results) return [];
	if (Array.isArray(results)) {
		return results.map(r => (Array.isArray(r) ? String(r[0]) : (r && r.phrase) ? String(r.phrase) : String(r))).filter(Boolean);
	}
	return [];
}

window.parseKeywords = function(text = '', n = 8) {
	try {
		// prefer a normalized RAKE extractor
		const out = rakeExtract(String(text));
		if (out) {
			const phrases = normalizeRakeOutput(out);
			return phrases.slice(0, n);
		}
	} catch (e) {
		console.warn('RAKE parse failed', e);
	}

	// fallback to local extractor if present
	try {
		if (typeof window.extractKeywords === 'function') {
			return window.extractKeywords(String(text), n);
		}
	} catch (e) {
		console.warn('Fallback extractKeywords failed', e);
	}

	return [];
};

export {};