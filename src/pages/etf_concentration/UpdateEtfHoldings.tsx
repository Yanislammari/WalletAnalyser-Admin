import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { toast } from 'sonner';
import EtfConcentrationService from '../../services/EtfConcentrationService';
import { ConfirmDialog } from '../../components/Confirm/Confirm';
import Loading from '../../components/Loading';

interface UpdateEtfHoldingsProps {
  handleSend: () => void;
  loading: boolean;
  form: string;
  setForm: React.Dispatch<React.SetStateAction<string>>;
  sectors: { sector_name: string; percentage_in_sector: number }[];
  countries: { country_name: string; percentage_in_country: number }[];
}

const COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
  '#14B8A6', '#E11D48',
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    const { name, value } = payload[0].payload;
    return (
      <div className="bg-slate-800 text-white rounded-lg px-3 py-2 text-xs shadow-lg">
        <div className="font-bold">{name}</div>
        <div className="text-slate-400">{value.toFixed(1)}%</div>
      </div>
    );
  }
  return null;
};

const DataTable = ({ data, nameKey }: { data: { name: string; value: number }[]; nameKey: string }) => {
  const [open, setOpen] = useState(false);
  const sorted = [...data].sort((a, b) => b.value - a.value);

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 rounded-md px-3 py-1.5 hover:border-gray-400 hover:text-gray-700 transition-colors bg-white"
      >
        <svg
          width="10" height="10" viewBox="0 0 12 12" fill="none"
          className={`transition-transform duration-200 ${open ? 'rotate-0' : '-rotate-90'}`}
        >
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {open ? 'Hide table' : 'Show data table'}
      </button>

      {open && (
        <table className="w-full mt-3 text-xs border-collapse">
          <thead>
            <tr>
              <th className="text-left text-gray-400 font-semibold uppercase tracking-wider text-[11px] pb-2 border-b-2 border-gray-200 px-2">{nameKey}</th>
              <th className="text-right text-gray-400 font-semibold uppercase tracking-wider text-[11px] pb-2 border-b-2 border-gray-200 px-2">Weight</th>
              <th className="text-gray-400 font-semibold uppercase tracking-wider text-[11px] pb-2 border-b-2 border-gray-200 px-2 w-24"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr key={row.name} className="hover:bg-gray-50">
                <td className="px-2 py-2 border-b border-gray-100 text-gray-700">
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="inline-block w-2 h-2 rounded-full shrink-0"
                      style={{ background: COLORS[i % COLORS.length] }}
                    />
                    {row.name}
                  </span>
                </td>
                <td className="px-2 py-2 border-b border-gray-100 text-right font-medium tabular-nums text-gray-900">
                  {row.value.toFixed(1)}%
                </td>
                <td className="px-2 py-2 border-b border-gray-100">
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(row.value, 100)}%`,
                        background: COLORS[i % COLORS.length],
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const ConcentrationCard = ({
  title, subtitle, data, nameKey,
}: {
  title: string;
  subtitle: string;
  data: { name: string; value: number }[];
  nameKey: string;
}) => (
  <div className="flex-1 min-w-70 bg-white rounded-xl border border-gray-200 p-5">
    <p className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-0.5">{title}</p>
    <p className="text-xs text-gray-400 mb-4">{subtitle}</p>

    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={85}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          iconType="circle"
          iconSize={7}
          formatter={(value) => (
            <span style={{ fontSize: '12px', color: '#4B5563' }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>

    <DataTable data={data} nameKey={nameKey} />
  </div>
);

const UpdateEtfHoldings: React.FC<UpdateEtfHoldingsProps> = ({
  handleSend, loading, form, setForm, sectors, countries,
}) => {
  const [open, setOpen] = useState(false);

  const sectorData = useMemo(() => {
    const total = sectors.reduce((sum, s) => sum + s.percentage_in_sector,0);
    const othersValue = Math.max(0, 100 - total);
    const data = sectors.map((s) => ({name: s.sector_name,value: s.percentage_in_sector}));

    const othersIndex = data.findIndex((item) => item.name === "Others");
    if (othersIndex !== -1) { data[othersIndex].value = othersValue + data[othersIndex].value } 
    else {
      data.push({
        name: "Others",
        value: othersValue,
      });
    }

    return data;
  }, [sectors]);

  const countryData = useMemo(() => {
    const total = countries.reduce((sum, s) => sum + s.percentage_in_country,0);
    const othersValue = Math.max(0, 100 - total);
    const data = countries.map((s) => ({name: s.country_name, value: s.percentage_in_country}));

    const othersIndex = data.findIndex((item) => item.name === "Others");
    if (othersIndex !== -1) { data[othersIndex].value = othersValue + data[othersIndex].value } 
    else {
      data.push({
        name: "Others",
        value: othersValue,
      });
    }

    return data;
  }, [countries]);

  const handleDownload = async () => {
    try {
      const blob = await EtfConcentrationService.getInstance().getExcelTemplate();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "etf_concentration.json";
      a.click();

      URL.revokeObjectURL(url);
    }
    catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-3">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2.5 px-4 py-3.5 bg-slate-800 text-white text-sm font-semibold tracking-tight hover:bg-slate-700 transition-colors text-left"
      >
        <svg
          width="10" height="10" viewBox="0 0 12 12" fill="none"
          className={`transition-transform duration-200 ${open ? 'rotate-0' : '-rotate-90'}`}
        >
          <path d="M2 4L6 8L10 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Update ETF Holdings
      </button>

      {open && (
        <div className="p-6 bg-slate-50 space-y-5">
          <div className="flex gap-5 flex-wrap">
            <ConcentrationCard
              title="Sector Concentration"
              subtitle={`${sectors.length} sectors`}
              data={sectorData}
              nameKey="Sector"
            />
            <ConcentrationCard
              title="Country Concentration"
              subtitle={`${countries.length} countries`}
              data={countryData}
              nameKey="Country"
            />
          </div>

          <div className="accordion-body">
            <ol style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "15px", marginTop: "-15px" }}>
              <li>
                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#9ca3af", marginBottom: "4px" }}>Step 1</div>
                <button onClick={handleDownload} className="accordion-get-template">
                  Download json template
                </button>
              </li>
              <li>
                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#9ca3af", marginBottom: "4px" }}>Step 2 - Paste the JSON from the API to update holdings</div>
                <textarea
                  value={form}
                  onChange={(e) => setForm(e.target.value)}
                  rows={10}
                  placeholder='{ "holdings": [...] }'
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-slate-50 text-xs font-mono text-slate-800 resize-y focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent"
                />
              </li>
            </ol>
            <ConfirmDialog
              title="Change all etf holdings"
              description="This will take a lot of time and is hard to undone. Note that all of your manual modification like adding/deleting an holding or changing its percentages will be deleted"
              confirmLabel= "Confirm"
              cancelLabel="Cancel"
              variant="danger"
              onConfirm={handleSend}
            >
              <button
                disabled={loading}
                className="mt-3 px-5 py-2.5 bg-slate-800 text-white text-sm font-semibold rounded-lg hover:bg-slate-700 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full"
              >
                {loading ? <Loading fullPage={false} spinnerSize={20} /> : "Send"}
              </button>
            </ConfirmDialog>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateEtfHoldings;
