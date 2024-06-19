// export async function loader({ context }: LoaderFunctionArgs) {
// 	const content = await getFileContentWithCache(context, 'README.md');

// 	return json(
// 		{
// 			content: parse(content),
// 		},
// 		{
// 			headers: {
// 				'Cache-Control': 'public, max-age=3600',
// 			},
// 		},
// 	);
// }

export default function Index() {
	return <h1> Routes | Index</h1>;
}
