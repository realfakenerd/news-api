import { sources } from '$lib/sources';
import axios from 'axios';
import { load } from 'cheerio';
import type { RequestHandler, RequestEvent } from './$types';
const articles: any[] = [];

sources.forEach(async (src) => {
	const res = await axios.get(src.address);
	const html = await res.data;

	const $ = load(html);
	$('a:contains("games")', html).each(function () {
		const title = $(this).text();
		const url = $(this).attr('href');
		articles.push({
			title,
			url: src.base ? src.address + url : url,
			sources: src.name
		});
	});
});

export async function GET({ request }: RequestEvent) {
	const response = new Response(JSON.stringify(articles));

	return response;
}
