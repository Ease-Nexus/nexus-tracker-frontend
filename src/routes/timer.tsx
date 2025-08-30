import { createRoute } from '@tanstack/react-router';
import Home from '@/Home';
import { rootRouter } from './__root';

export const timerRoute = createRoute({
	getParentRoute: () => rootRouter,
	path: '/',
	component: Home,
});
