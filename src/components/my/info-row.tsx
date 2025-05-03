interface Props {
  label: string;
  value: string;
}

export const InfoRow = ({ label, value }: Props) => (
  <p className="text-sm flex">
    <span className="w-20 shrink-0 text-gray-500 dark:text-gray-400">
      {label}
    </span>
    <span className="font-medium">{value}</span>
  </p>
);
