export default function BoolRow({ label, value }) {
    if (!value) return null;
    return (
        <span className="inline-flex items-center gap-1 bg-primary-50
                     text-primary-600 text-xs font-medium px-2.5 py-1
                     rounded-full">
            ✓ {label}
        </span>
    );
}