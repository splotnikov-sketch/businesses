export function isNullOrEmpty(objectToCheck) {
	return (
		objectToCheck === null ||
		objectToCheck === undefined ||
		objectToCheck === '' ||
		(Array.isArray(objectToCheck) && objectToCheck.length < 1) ||
		(typeof objectToCheck === 'object' &&
			Object.keys(objectToCheck).length === 0)
	);
}
