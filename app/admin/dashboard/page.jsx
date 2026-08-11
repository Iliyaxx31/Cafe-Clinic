"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [notice, setNotice] = useState({ active: false, text: "" });
  const router = useRouter();

  useEffect(() => {
    fetchData();
    fetchNotice();
  }, []);

  const fetchNotice = async () => {
    const res = await fetch("/api/notice");
    if (res.ok) {
      const data = await res.json();
      setNotice(data);
    }
  };

  const saveNotice = async () => {
    await fetch("/api/notice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notice),
    });
    alert("اطلاعیه ذخیره شد!");
  };

  const fetchData = async () => {
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getData" }),
    });
    if (res.ok) {
      const result = await res.json();
      setData(result.data);
      setPrices(result.prices);
      if (result.data.categories.length > 0 && !selectedCategory) {
        setSelectedCategory(result.data.categories[0]);
      }
    }
    setLoading(false);
  };

  const updatePrice = async (itemId, newPrice) => {
    const newPrices = { ...prices, [itemId]: newPrice };
    setPrices(newPrices);
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "updatePrices", data: { prices: newPrices } }),
    });
  };

  const updateItemField = async (categoryId, itemId, field, value) => {
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "updateItem", data: { categoryId, itemId, updatedItem: { [field]: value } } }),
    });
    if (res.ok) {
      const newData = { ...data };
      const category = newData.categories.find((c) => c.id === categoryId);
      const item = category.items.find((i) => i.id === itemId);
      item[field] = value;
      setData(newData);
    }
  };

  const deleteItem = async (categoryId, itemId) => {
    if (confirm("آیا از حذف این محصول مطمئن هستید؟")) {
      await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteItem", data: { categoryId, itemId } }),
      });
      fetchData();
    }
  };

  const deleteCategory = async (categoryId) => {
    if (confirm("آیا از حذف این دسته‌بندی و تمام محصولات آن مطمئن هستید؟")) {
      const newData = { ...data };
      newData.categories = newData.categories.filter((c) => c.id !== categoryId);
      await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateData", data: { data: newData } }),
      });
      fetchData();
      if (selectedCategory?.id === categoryId) setSelectedCategory(null);
    }
  };

  const addItem = async (newItem) => {
    if (!selectedCategory) return;
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "addItem", data: { categoryId: selectedCategory.id, newItem } }),
    });
    fetchData();
    setShowAddModal(false);
  };

  const addCategory = async (newCategory) => {
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "addCategory", data: { newCategory } }),
    });
    fetchData();
    setShowCatModal(false);
  };

  const logout = () => {
    document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/admin/login");
  };

  if (loading) return <div className="p-8 text-center">در حال بارگذاری...</div>;
  if (!data) return <div className="p-8 text-center">خطا در بارگذاری اطلاعات</div>;

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">پنل مدیریت - {data.cafeName}</h1>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            خروج
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* GUNUN NOTU BOLUMU */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-bold mb-3"> اطلاعیه روز</h2>
          <textarea
            value={notice.text}
            onChange={(e) => setNotice({ ...notice, text: e.target.value })}
            placeholder="متن اطلاعیه را اینجا بنویسید..."
            className="w-full p-2 border rounded mb-3"
            rows="3"
          />
          <div className="flex gap-3 items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={notice.active}
                onChange={(e) => setNotice({ ...notice, active: e.target.checked })}
                className="w-4 h-4"
              />
              <span>{notice.active ? " فعال" : "❌ غیرفعال"}</span>
            </label>
            <button
              onClick={saveNotice}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              ذخیره
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {data.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded whitespace-nowrap ${selectedCategory?.id === cat.id ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
            >
              {cat.name} ({cat.items.length})
            </button>
          ))}
          <button
            onClick={() => setShowCatModal(true)}
            className="px-4 py-2 rounded bg-green-500 text-white whitespace-nowrap hover:bg-green-600"
          >
            + دسته‌بندی جدید
          </button>
        </div>

        {selectedCategory && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold">{selectedCategory.name}</h2>
                <button
                  onClick={() => deleteCategory(selectedCategory.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  حذف دسته‌بندی
                </button>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                + محصول جدید
              </button>
            </div>

            {selectedCategory.items.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                هنوز محصولی اضافه نشده است.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-right">شناسه</th>
                      <th className="px-4 py-2 text-right">نام محصول</th>
                      <th className="px-4 py-2 text-right">توضیحات</th>
                      <th className="px-4 py-2 text-right">قیمت (Toman)</th>
                      <th className="px-4 py-2 text-right">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCategory.items.map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="px-4 py-2">{item.id}</td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            defaultValue={item.name}
                            onBlur={(e) => updateItemField(selectedCategory.id, item.id, "name", e.target.value)}
                            className="w-full p-1 border rounded"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            defaultValue={item.description}
                            onBlur={(e) => updateItemField(selectedCategory.id, item.id, "description", e.target.value)}
                            className="w-full p-1 border rounded"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            defaultValue={prices[item.id] || "0"}
                            onBlur={(e) => updatePrice(item.id, e.target.value)}
                            className="w-24 p-1 border rounded"
                          /> Toman
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => deleteItem(selectedCategory.id, item.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            حذف
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {showAddModal && (
        <AddItemModal
          onClose={() => setShowAddModal(false)}
          onSave={addItem}
          categoryName={selectedCategory?.name}
        />
      )}
      {showCatModal && (
        <AddCategoryModal
          onClose={() => setShowCatModal(false)}
          onSave={addCategory}
        />
      )}
    </div>
  );
}

function AddItemModal({ onClose, onSave, categoryName }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("لطفا نام محصول را وارد کنید!");
    onSave({ name, description, img: "/da.jpg" });
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-2">افزودن محصول جدید</h2>
        <p className="text-gray-600 mb-4">دسته‌بندی: <span className="font-semibold">{categoryName}</span></p>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="نام محصول *" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 mb-3 border rounded" required />
          <textarea placeholder="توضیحات" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 mb-4 border rounded" rows="3" />
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">افزودن</button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600">انصراف</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddCategoryModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("لطفا نام دسته‌بندی را وارد کنید!");
    onSave({ name });
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">افزودن دسته‌بندی جدید</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="نام دسته‌بندی *" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 mb-4 border rounded" required />
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600">افزودن</button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600">انصراف</button>
          </div>
        </form>
      </div>
    </div>
  );
}