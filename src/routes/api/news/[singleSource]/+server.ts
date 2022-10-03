import { sources } from '$lib/sources';
import { load } from 'cheerio';
import axios from 'axios';
import type { RequestEvent } from './$types';

export async function GET({ params }: RequestEvent) {
	const srcId = params.singleSource;
	const { address, base } = sources.find((s) => s.name == srcId)!;
	const specificArticle: any[] = [];
	const response = await axios.get(address);
	const html = response.data;
	const $ = load(html);

	$('a:contains("games")', html).each(function () {
		const title = $(this).text();
		const url = $(this).attr('href');

		specificArticle.push({
			title,
			url: base ? address + url : url,
			source: srcId
		});
	});

    return new Response(JSON.stringify(specificArticle));
}
