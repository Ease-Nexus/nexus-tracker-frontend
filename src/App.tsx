import { createRouter, RouterProvider } from '@tanstack/react-router';
import { rootRouter } from './routes/__root';
import { timerRoute } from './routes/timer';

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}

const routeTree = rootRouter.addChildren([timerRoute]);

const router = createRouter({ routeTree });

export const App = () => {
	return <RouterProvider router={router} />;
};
