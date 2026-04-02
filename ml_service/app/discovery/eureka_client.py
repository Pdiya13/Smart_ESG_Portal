import py_eureka_client.eureka_client as eureka_client
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

async def register_eureka():
    logger.info(f"Registering ML Service {settings.app_name} with Eureka at {settings.eureka_server_url}")
    try:
        await eureka_client.init_async(
            eureka_server=settings.eureka_server_url,
            app_name=settings.app_name,
            instance_port=settings.port,
            instance_host=settings.host_ip,
            health_check_url=f"http://{settings.host_ip}:{settings.port}/health",
            status_page_url=f"http://{settings.host_ip}:{settings.port}/health",
        )
        logger.info(f"Successfully registered {settings.app_name} with Eureka")
    except Exception as e:
        logger.error(f"Failed to register with Eureka: {e}")
        # Not throwing exception here to allow FastAPI to start independently if Eureka is down,
        # but in production you might want to retry or abort startup.

async def deregister_eureka():
    logger.info(f"Deregistering ML Service {settings.app_name} from Eureka")
    try:
        await eureka_client.stop_async()
        logger.info(f"Successfully deregistered {settings.app_name} from Eureka")
    except Exception as e:
        logger.error(f"Failed to deregister from Eureka: {e}")
