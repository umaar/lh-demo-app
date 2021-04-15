import lhci from '@lhci/server';

const {createServer} = lhci;

async function start() {
	console.log('Starting the lhci server');

	try {
		const {port} = await createServer({
			port: process.env.PORT,
			storage: {
				storageMethod: 'sql',
				sqlDialect: 'postgres',
				sqlConnectionSsl: true,
				sqlDialectOptions: {ssl: {
					require: true,
					rejectUnauthorized: false
				}},
				sqlConnectionUrl: process.env.DATABASE_URL
			}
		});

		console.log('lhci server started on port:', port);
	} catch (error) {
		throw error;
	}
}

start();
