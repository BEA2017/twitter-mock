const datefns = require('date-fns');
const locale = require('date-fns/locale');

export const dateFormatter = (date) => {
	const oneHour = 3600000;
	const oneDay = 86400000;
	const now = Date.now();
	const diff = now - date;
	if (diff < oneHour) return `${datefns.formatDistance(date, now, { locale: locale.ru })} назад`;
	if (diff < oneDay) return new Date(date).toLocaleTimeString();
	return new Date(date).toLocaleDateString();
};

export const messengerTimeFormatter = (date) => {
	const time = new Date(date).toTimeString().split(':');
	return `${time[0]}:${time[1]}`;
};
