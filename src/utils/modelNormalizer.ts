export default function(data: any, model: any) {
	if (!data || !data.length || !model) {
		return data;
	}

	return data.map((item: any) => {
		return new model(item);
	});
}
