import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params, locals }) => {
	let ac;

	try {
		const queryStatus = {
			iZoneV2Request: {
				Type: 1,
				No: 0,
				No1: 0
			}
		};

		const response = await fetch('https://api.izone.com.au/testsimplelocalcocb', {
			method: 'POST',
			mode: 'no-cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(queryStatus)
		});
		ac = await response.json();

	} catch (error) {
		console.error('Error fetching data:', error);
	}

	return { ac };
};
