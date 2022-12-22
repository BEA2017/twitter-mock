import { clear_search_results } from '../store/tweetsSlice';

export const searchFormatter = (body, query) => {
	const matchIndexes = [];
	let pos = -1;
	do {
		pos = body.toLowerCase().indexOf(query.toLowerCase(), pos + 1);
		pos !== -1 && matchIndexes.push(pos);
	} while (pos !== -1);

	let formattedTweetBody = [];
	let prev = 0;
	matchIndexes.forEach((i, idx) => {
		formattedTweetBody.push(body.slice(prev, i));
		formattedTweetBody.push(
			<span key={idx} className="body_query-result">
				{body.slice(i, i + query.length)}
			</span>,
		);
		prev = i + query.length;
	});
	if (matchIndexes.at(-1) + query.length < body.length) {
		formattedTweetBody.push(body.slice(matchIndexes.at(-1) + query.length, body.length));
	}

	return formattedTweetBody;
};

export const hashtagsFormatter = (body, navigate, dispatch) => {
	const formatHashtags = (str) => {
		const matches = str.matchAll(/#[A-Za-z0-9А-Яа-я]+/g);
		let formatted = [];
		let prev = 0;

		const onClickHashTag = (e, match) => {
			e.preventDefault();
			navigate(`/search?q=${encodeURIComponent(match)}`);
			dispatch(clear_search_results());
		};

		for (let match of matches) {
			formatted.push(str.slice(prev, match.index));
			formatted.push(
				<span key={prev} className="hashtag" onClick={(e) => onClickHashTag(e, match)}>
					{match}
				</span>,
			);
			prev = match.index + match.toString().length;
		}
		return formatted.length > 0 ? formatted : str;
	};

	return formatHashtags(body);
};
