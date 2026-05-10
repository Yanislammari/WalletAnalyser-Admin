import PageLayout from "../../components/Navbar/NavBarPageLayout";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../../components/Loading";
import ErrorContainer from "../../components/Error";
import SearchBar from "../../components/SearchBar/SearchBar";
import CurrenciesService from "../../services/CurrenciesService";
import type { CurrencyNameResponse } from "../../payloads/CurrencyPayload";
import AddCurrencyForm, { type FormProps } from "./AddCurrency";
import { CurrencyRow } from "./Currency_components";

const Currencies: React.FC = () => {
  return (
    <PageLayout>
      <CurrenciesDashboard />
    </PageLayout>
  );
};

const CurrenciesDashboard: React.FC = () => {
  const currenciesService = CurrenciesService.getInstance();
  const [currencies, setCurrencies] = useState<CurrencyNameResponse[] | null>([]);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<FormProps>({ currency_name: "" });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const fetchCurrencies = async () => {
      setLoading(true);
      try {
        const response = await currenciesService.getCurrencies();
        setCurrencies(response.currencies);
      } catch (error: any) {
        setHasError(true);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  const handleAddCurrency = async () => {
    try {
      if (form.currency_name.trim() === "") {
        toast.error("All fields are required");
        return;
      }
      setFormLoading(true);
      const response = await currenciesService.postCurrency({ currency_name: form.currency_name.trim() });
      const exists = currencies?.some((item) => item.uuid === response.uuid);
      if (!exists) {
        setCurrencies((prev) =>
          [...prev ?? [], response].sort((a, b) => a.currency_name.localeCompare(b.currency_name))
        );
        toast.success(`Currency ${response.currency_name} added successfully`);
      } else {
        toast.error(`Currency ${response.currency_name} already exists`);
      }
      setForm({ currency_name: "" });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditCurrency = async (uuid: string, newName: string) => {
    try {
      if (newName.trim() === "") {
        toast.error("All fields are required");
        return;
      }
      const response = await currenciesService.patchCurrency({ currency_name: newName.trim() }, uuid);
      setCurrencies((prev) =>
        prev?.map((item) => (item.uuid === uuid ? response : item)).sort((a, b) => a.currency_name.localeCompare(b.currency_name)) ?? []
      );
      toast.success(`Currency ${response.currency_name} updated successfully`);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDeleteCurrency = async (uuid: string) => {
    try {
      const response = await currenciesService.delete(uuid);
      if (response.message === "Currency deleted successfully") {
        setCurrencies((prev) => prev?.filter((item) => item.uuid !== uuid) ?? []);
        toast.success("Currency deleted successfully");
        return;
      }
      toast.error("Something went wrong while deleting this currency");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (hasError) {
    return <ErrorContainer errorMessage={"An error occurred, try again later"} />;
  }

  if (loading || currencies == null) {
    return <Loading />;
  }

  return (
    <>
      <div className="dash-wrap">
        <p className="dash-title">Currencies Dashboard</p>

        <AddCurrencyForm form={form} setForm={setForm} handleSend={handleAddCurrency} loading={formLoading} />

        <div className="table-wrap">
          <div className="table-header">
            <h2>Currencies management</h2>
            <SearchBar value={search} onChange={(value) => setSearch(value)} />
            <div style={{ color: "white" }}>{currencies.length ?? 0} elements</div>
          </div>
          <table className="country-table">
            <thead>
              <tr>
                <th className="email-cell">Currency name</th>
                <th className="actions-cell">Actions</th>
              </tr>
            </thead>
            <colgroup>
              <col style={{ width: "75%" }} />
              <col />
            </colgroup>
            <tbody>
              {currencies.filter((value) => value.currency_name.toLowerCase().startsWith(search.toLowerCase())).map((currency) => (
                <CurrencyRow
                  key={currency.uuid}
                  currency={currency}
                  onSave={handleEditCurrency}
                  onDelete={handleDeleteCurrency}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Currencies;
