import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AppLayout } from "./runtracker/components/layout/AppLayout";
import { RoutesHome } from "./runtracker/components/routes/RoutesHome";
import { RouteDetailPage } from "./runtracker/components/detail/RouteDetailPage";
import { StatsPage } from "./runtracker/components/stats/StatsPage";
import ErrorPage from "./runtracker/components/errorpage";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { staleTime: 30 * 1000, refetchOnWindowFocus: false },
    },
});

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <AppLayout />,
            errorElement: <ErrorPage />,
            children: [
                { index: true, element: <RoutesHome /> },
                { path: "tracks/:trackId", element: <RouteDetailPage /> },
                { path: "charts", element: <StatsPage /> },
            ],
        },
    ],
    { basename: "/runtracker-app" },
);

export default function App() {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
                <Toaster position="top-center" />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </ThemeProvider>
    );
}
