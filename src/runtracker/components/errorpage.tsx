import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);
    const detail = isRouteErrorResponse(error) ? error.statusText : error instanceof Error ? error.message : undefined;

    return (
        <main className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-background p-6 text-center">
            <h1 className="font-display text-3xl font-extrabold">Algo ha fallado</h1>
            <p className="text-muted-foreground">Se ha producido un error inesperado.</p>
            {detail && <p className="text-sm italic text-muted-foreground">{detail}</p>}
            <Link to="/" className="mt-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
                Volver a rutas
            </Link>
        </main>
    );
}
