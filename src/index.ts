import { LoggerFactory } from '@venizia/ignis-helpers';
import { Application, appConfigs } from './application';

const logger = LoggerFactory.getLogger(['main']);

const main = async () => {
  const application = new Application({ scope: Application.name, config: appConfigs });

  application.init();

  const applicationName = process.env.APP_ENV_APPLICATION_NAME?.toUpperCase() ?? 'My-App';
  logger.for('runApplication').info('Getting ready to start up %s Application...', applicationName);

  try {
    const bootReport = await application.boot();
    logger.info('Boot report: %j', bootReport);
  } catch (error) {
    logger.error(
      'Application boot failed | Application Name: %s | Error: %s',
      applicationName,
      error,
    );
    process.exit(1);
  }

  try {
    await application.start();
  } catch (error) {
    logger.error(
      'Application start failed | Application Name: %s | Error: %s',
      applicationName,
      error,
    );
    process.exit(1);
  }

  return application;
};

main();
