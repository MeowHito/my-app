"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { create } from "zustand";
import { nanoid } from "nanoid";

// ---------------- Store ----------------
type Student = {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  school: string;
  gpa: number;
  skills: string;
  reason: string;
  faculty: string;
  university: string;
  image?: string; // base64
};

type Store = {
  students: Student[];
  addStudent: (s: Student) => void;
};

const usePortfolioStore = create<Store>((set) => ({
  students: [],
  addStudent: (s) => set((state) => ({ students: [...state.students, s] })),
}));

// ---------------- Component ----------------
export default function CAS69Portfolio() {
  const { register, handleSubmit, reset } = useForm<Student>();
  const { students, addStudent } = usePortfolioStore();
  const [selected, setSelected] = useState<Student | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<"gpa" | "firstName">("gpa");

  const onSubmit = (data: Student) => {
    const newStudent = {
      ...data,
      id: nanoid(),
      gpa: Number(data.gpa),
      image: preview || undefined,
    };
    addStudent(newStudent);
    reset();
    setPreview(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const sortedStudents = [...students].sort((a, b) => {
    if (sortKey === "gpa") return b.gpa - a.gpa;
    return a.firstName.localeCompare(b.firstName);
  });

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        CAS69 Portfolio Form
      </h1>

      {/* ----------- Form ----------- */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-800 p-6 rounded-2xl shadow-lg max-w-2xl mx-auto space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <input
            {...register("firstName", { required: true })}
            placeholder="ชื่อ"
            className="p-2 rounded bg-gray-700 text-white"
          />
          <input
            {...register("lastName", { required: true })}
            placeholder="นามสกุล"
            className="p-2 rounded bg-gray-700 text-white"
          />
        </div>

        <input
          {...register("address", { required: true })}
          placeholder="ที่อยู่"
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <input
          {...register("phone", { required: true })}
          placeholder="หมายเลขโทรศัพท์"
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <input
          {...register("school", { required: true })}
          placeholder="โรงเรียน"
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <input
          {...register("gpa", { required: true, valueAsNumber: true })}
          placeholder="GPA"
          type="number"
          step="0.01"
          min="0"
          max="4"
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <input
          {...register("skills")}
          placeholder="ความสามารถพิเศษ"
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <textarea
          {...register("reason")}
          placeholder="เหตุผลในการสมัครเข้าเรียน"
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <input
          {...register("faculty")}
          placeholder="สาขาที่เลือก"
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <input
          {...register("university")}
          placeholder="มหาวิทยาลัย"
          className="w-full p-2 rounded bg-gray-700 text-white"
        />

        {/* Upload image */}
        <div>
          <label className="block mb-2">อัปโหลดรูปภาพ</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full text-gray-300"
          />
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-2 w-32 h-32 object-cover rounded-xl border border-gray-600"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-xl transition"
        >
          เพิ่ม Portfolio
        </button>
      </form>

      {/* ----------- Table ----------- */}
      <div className="mt-12 max-w-4xl mx-auto">
        <h2 className="text-2xl mb-4 font-semibold">รายชื่อนักเรียน</h2>
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setSortKey("gpa")}
            className={`px-4 py-2 rounded ${
              sortKey === "gpa" ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            เรียงตาม GPA
          </button>
          <button
            onClick={() => setSortKey("firstName")}
            className={`px-4 py-2 rounded ${
              sortKey === "firstName" ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            เรียงตามชื่อ
          </button>
        </div>

        <table className="w-full border border-gray-700 rounded-xl overflow-hidden">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-2">ชื่อ</th>
              <th className="p-2">นามสกุล</th>
              <th className="p-2">GPA</th>
              <th className="p-2">รายละเอียด</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((s) => (
              <tr
                key={s.id}
                className="odd:bg-gray-800 even:bg-gray-900 hover:bg-gray-700 transition"
              >
                <td className="p-2">{s.firstName}</td>
                <td className="p-2">{s.lastName}</td>
                <td className="p-2 text-center">{s.gpa.toFixed(2)}</td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => setSelected(s)}
                    className="text-blue-400 hover:underline"
                  >
                    ดูเพิ่มเติม
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ----------- Modal Detail ----------- */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg max-w-lg w-full relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4">
              {selected.firstName} {selected.lastName}
            </h3>
            {selected.image && (
              <img
                src={selected.image}
                alt="student"
                className="w-40 h-40 object-cover rounded-xl mb-4"
              />
            )}
            <p><b>ที่อยู่:</b> {selected.address}</p>
            <p><b>โทรศัพท์:</b> {selected.phone}</p>
            <p><b>โรงเรียน:</b> {selected.school}</p>
            <p><b>GPA:</b> {selected.gpa.toFixed(2)}</p>
            <p><b>ความสามารถพิเศษ:</b> {selected.skills}</p>
            <p><b>เหตุผล:</b> {selected.reason}</p>
            <p><b>สาขา:</b> {selected.faculty}</p>
            <p><b>มหาวิทยาลัย:</b> {selected.university}</p>
          </div>
        </div>
      )}
    </div>
  );
}
