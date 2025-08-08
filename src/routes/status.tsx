import T from "~/components/T";

export default function PublicDashboard() {
    return (
        <main class="mt-48">
            <h1 class="text-center m-auto text-amber-200 p-4 max-6-xs text-6xl font-fancy uppercase">
                <T t="${status}"/>
                System sprawdzania statusu jest obecnie w budowie...
            </h1>
        </main>
    );
}