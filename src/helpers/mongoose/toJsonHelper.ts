export default function() {
	return {
		virtuals: true,
		transform: (_document: any, response: any) => {
			delete response.__v;

			if (response._id && response._id.toString) {
				response.id = response._id.toString();
			}
		},
	};
}
