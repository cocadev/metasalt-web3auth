import Head from 'next/head';

export const MetaTag = ({ title, description, image }) => {
	return (
		<Head>
			<title>{title}</title>
			<meta charSet="utf-8" />
			<meta name="viewport" content="width=device-width,initial-scale=1" />
			<meta name="theme-color" content="#000000" />
			<meta name="title" content={title} />
			<meta name="description" content={description}/>
			<meta name="image" content={image} />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description}/>
			<meta property="og:image" content={image} />
			<meta name="twitter:title" content={title}/>
			<meta name="twitter:description" content={description}/>
			<meta name="twitter:image" content={image} />
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:site" content="@Metasalt" />
			<meta name="twitter:creator" content="@Metasalt" />
		</Head>
	);
};

