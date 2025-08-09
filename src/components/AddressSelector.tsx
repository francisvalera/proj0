"use client";

import { useState, useEffect } from "react";

interface AddressData {
  [province: string]: {
    municipality_list: {
      [city: string]: {
        barangay_list: string[];
      };
    };
  };
}

export default function AddressSelector() {
  const [addressData, setAddressData] = useState<AddressData>({});
  const [provinces, setProvinces] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [barangays, setBarangays] = useState<string[]>([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch from the local public folder
        const response = await fetch('/ph_geodata_2019v2.json');
        const data = await response.json();
        
        const provincesList: AddressData = {};
        Object.values(data).forEach((region: any) => {
          Object.assign(provincesList, region.province_list);
        });

        setAddressData(provincesList);
        setProvinces(Object.keys(provincesList).sort());
      } catch (error) {
        console.error("Failed to fetch address data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedProvince && addressData[selectedProvince]) {
      setCities(Object.keys(addressData[selectedProvince].municipality_list).sort());
      setSelectedCity("");
      setBarangays([]);
    } else {
      setCities([]);
      setBarangays([]);
    }
  }, [selectedProvince, addressData]);

  useEffect(() => {
    if (selectedCity && addressData[selectedProvince]?.municipality_list[selectedCity]) {
      setBarangays(addressData[selectedProvince].municipality_list[selectedCity].barangay_list.sort());
    } else {
      setBarangays([]);
    }
  }, [selectedCity, selectedProvince, addressData]);

  return (
    <>
      <div className="sm:col-span-1">
        <label htmlFor="province" className="block text-sm font-medium">Province</label>
        <select id="province" name="province" value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md">
          <option value="">Select Province</option>
          {provinces.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <div className="sm:col-span-1">
        <label htmlFor="city" className="block text-sm font-medium">City / Municipality</label>
        <select id="city" name="city" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} required disabled={!selectedProvince} className="w-full px-3 py-2 mt-1 border rounded-md disabled:bg-gray-100">
          <option value="">Select City / Municipality</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="barangay" className="block text-sm font-medium">Barangay / District</label>
        <select id="barangay" name="barangay" required disabled={!selectedCity} className="w-full px-3 py-2 mt-1 border rounded-md disabled:bg-gray-100">
          <option value="">Select Barangay / District</option>
          {barangays.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
    </>
  );
}
