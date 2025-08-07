export default function Dashboard(props: {children: any}) {
    return (
        <div class="flex flex-wrap">
            {props.children}
        </div>
    );
}