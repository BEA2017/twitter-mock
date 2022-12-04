export const validateRegistration = (obj) => {
	const errors = {};
	const validators = {
		login: [
			{
				pattern: /^[a-z0-9_-]+$/gi,
				message: 'Только латинские буквы',
			},
			{
				pattern: /^.{5,15}/,
				message: 'Допустимая длина: 5-15 символов',
			},
		],
		name: [
			{
				pattern: /(^[a-z]+$)|(^[а-я]+$)/gi,
				message: 'Только латинские или только русские буквы',
			},
			{
				pattern: /^.{5,15}/,
				message: 'Допустимая длина: 5-15 символов',
			},
		],
		surname: [
			{
				pattern: /(^[a-z]+$)|(^[а-я]+$)/gi,
				message: 'Только латинские или только русские буквы',
			},
			{
				pattern: /^.{5,15}/,
				message: 'Допустимая длина: 5-15 символов',
			},
		],
		email: [
			{
				pattern: /^[a-z0-9_]{3,15}@[a-z0-9]{3,10}\.((ru)|(com)|(org))$/i,
				message: 'Некорректный email',
			},
		],
	};

	Object.keys(obj).forEach((key) => {
		validators[key]?.forEach((validator) => {
			const isValid = validator.pattern.test(obj[key]);
			if (!isValid) {
				errors[key] ? errors[key].push(validator.message) : (errors[key] = [validator.message]);
			}
		});
	});

	return errors;
};
