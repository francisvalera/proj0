"use client";

import { useState, useEffect } from "react";

// Mock data - In a real app, this would come from an API
const addressData = {
  "Metro Manila": {
    "Manila": ["Tondo", "Sampaloc", "Santa Cruz"],
    "Quezon City": ["Diliman", "Cubao", "Novaliches"],
  },
  "Bulacan": {
    "Malolos": ["Caingin", "Sto. Rosario"],
    "Marilao": ["Abangan Norte", "Loma de Gato", "Poblacion II"],
  }
};

export default function AddressSelector() {
  const [provinces] = useState(Object.keys(addressData));
  const [cities, setCities] = useState<string[]>([]);
  const [barangays, setBarangays] = useState<string[]>([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    if (selectedProvince) {
      setCities(Object.keys(addressData[selectedProvince as keyof typeof addressData]));
      setSelectedCity("");
      setBarangays([]);
    } else {
      setCities([]);
      setBarangays([]);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedCity) {
      const provinceData = addressData[selectedProvince as keyof typeof addressData];
      setBarangays(provinceData[selectedCity as keyof typeof provinceData]);
    } else {
      setBarangays([]);
    }
  }, [selectedCity]);

  return (
    <>
      <div className="sm:col-span-1">
        <label className="block text-sm font-medium">Province</label>
        <select
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
          required
          className="w-full px-3 py-2 mt-1 border rounded-md"
        >
          <option value="">Select Province</option>
          {provinces.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <div className="sm:col-span-1">
        <label className="block text-sm font-medium">City / Municipality</label>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          required
          disabled={!selectedProvince}
          className="w-full px-3 py-2 mt-1 border rounded-md disabled:bg-gray-100"
        >
          <option value="">Select City / Municipality</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium">Barangay / District</label>
        <select required disabled={!selectedCity} className="w-full px-3 py-2 mt-1 border rounded-md disabled:bg-gray-100">
          <option value="">Select Barangay / District</option>
          {barangays.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
    </>
  );
}
