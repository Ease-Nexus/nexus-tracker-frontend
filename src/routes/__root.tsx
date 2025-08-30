import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
export const rootRouter = createRootRoute({
	component: () => (
		<>
			<div className="p-2 flex gap-2">
				<Link to="/">Timer</Link>
			</div>
			<hr />
			<Outlet />
			<TanStackRouterDevtools />
		</>
	),
});
