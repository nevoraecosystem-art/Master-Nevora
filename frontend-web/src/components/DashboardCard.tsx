interface Props {
  title: string;
  value: string | number;
  description?: string;
}

const DashboardCard = ({ title, value, description }: Props) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-sm font-medium text-slate-500">{title}</div>
      <div className="mt-2 text-2xl font-bold text-primary-dark">{value}</div>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>
  );
};

export default DashboardCard;
