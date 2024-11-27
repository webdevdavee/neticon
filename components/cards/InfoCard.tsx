type Props = {
  title: string;
  content: string;
  icon: React.ReactNode;
};

const InfoCard: React.FC<Props> = ({ title, icon, content }) => {
  return (
    <div className="bg-white p-6 max-h-48 rounded-lg shadow-md overflow-hidden flex flex-col gap-2">
      <div className="flex gap-4">
        {icon}
        <h4 className="font-semibold mb-2 text-gray-800">{title}</h4>
      </div>
      <p className="text-gray-600 text-sm">{content}</p>
    </div>
  );
};

export default InfoCard;
