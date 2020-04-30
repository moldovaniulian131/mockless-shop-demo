import * as serverless from 'serverless-http';
import createApplication from '../express/createApplication';

export default function(routers: any) {
	return serverless(createApplication(routers));
}
